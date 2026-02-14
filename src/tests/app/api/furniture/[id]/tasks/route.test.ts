import type { NextRequest } from "next/server";
import type { MaintenanceStatus } from "@/types/maintenance";

const { createSupabaseApiClientMock } = vi.hoisted(() => ({
  createSupabaseApiClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseApiClient: createSupabaseApiClientMock,
}));

type RecordRow = {
  id: string;
  task_id: string | null;
  performed_at: string;
  next_due_date: string | null;
  status: MaintenanceStatus | null;
};

type TaskRowWithRecords = {
  id: string;
  name: string;
  cycle_value: number;
  cycle_unit: string;
  description: string | null;
  is_active: boolean | null;
  created_at: string | null;
  maintenance_records: RecordRow[];
};

function buildSupabaseMock(tasks: TaskRowWithRecords[]) {
  const orderMock = vi.fn().mockResolvedValue({ data: tasks, error: null });
  const eqMock = vi.fn().mockReturnValue({ order: orderMock });
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

  const fromMock = vi.fn((table: string) => {
    if (table === "maintenance_tasks") {
      return { select: selectMock };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      }),
    },
    from: fromMock,
  };
}

describe("GET /api/furniture/[id]/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("is_active/created_at が null の legacy 行があっても 500 にせず返却できる", async () => {
    const supabaseMock = buildSupabaseMock([
      {
        id: "task-legacy",
        name: "legacy task",
        cycle_value: 7,
        cycle_unit: "days",
        description: null,
        is_active: null,
        created_at: null,
        maintenance_records: [
          {
            id: "record-1",
            task_id: "task-legacy",
            performed_at: "2026-02-02",
            next_due_date: "2026-02-09",
            status: "completed",
          },
          {
            id: "record-2",
            task_id: "task-legacy",
            performed_at: "2026-01-25",
            next_due_date: "2026-02-01",
            status: null,
          },
        ],
      },
      {
        id: "task-normal",
        name: "normal task",
        cycle_value: 30,
        cycle_unit: "days",
        description: "desc",
        is_active: true,
        created_at: "2026-02-01T00:00:00.000Z",
        maintenance_records: [],
      },
    ]);

    createSupabaseApiClientMock.mockResolvedValue(supabaseMock);

    const { GET } = await import("@/app/api/furniture/[id]/tasks/route");
    const response = await GET(
      new Request("http://localhost/api/furniture/f-1/tasks") as NextRequest,
      {
        params: Promise.resolve({ id: "f-1" }),
      },
    );

    expect(response.status).toBe(200);

    const body = (await response.json()) as Array<{
      id: string;
      is_active: boolean;
      created_at: string;
      records: Array<{ id: string }>;
    }>;

    expect(body).toHaveLength(2);

    const legacyTask = body.find((task) => task.id === "task-legacy");
    expect(legacyTask).toBeDefined();
    expect(legacyTask?.is_active).toBe(false);
    expect(legacyTask?.created_at).toBe("1970-01-01T00:00:00.000Z");
    expect(legacyTask?.records).toHaveLength(1);
    expect(legacyTask?.records[0]?.id).toBe("record-1");
  });
});

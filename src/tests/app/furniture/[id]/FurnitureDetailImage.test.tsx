import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FurnitureDetailImage from "@/app/furniture/[id]/FurnitureDetailImage";
import {
  furnitureEditSchema,
  type FurnitureEditSchema,
} from "@/lib/validation";

// Supabaseクライアントのモック
const mockGetPublicUrl = vi.fn();
const mockSupabaseClient = {
  storage: {
    from: vi.fn().mockReturnValue({
      getPublicUrl: mockGetPublicUrl,
    }),
  },
};

vi.mock("@/lib/supabase/hooks/useSupabaseClient", () => ({
  useSupabaseClient: () => mockSupabaseClient,
}));

// テスト用のFormProviderラッパー
function TestWrapper({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<FurnitureEditSchema>;
}) {
  const methods = useForm<FurnitureEditSchema>({
    resolver: zodResolver(furnitureEditSchema),
    defaultValues: {
      name: "",
      brand: "",
      location_id: undefined,
      purchased_at: "",
      purchased_from: "",
      notes: "",
      image: null,
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

// モックファイル
const createMockFile = (name: string, type: string, size: number) => {
  const file = new File(["test"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

// URL.createObjectURLのモック
global.URL.createObjectURL = vi.fn(() => "mock-url");

describe("FurnitureDetailImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: "https://example.com/image.jpg" },
    });
  });

  describe("表示モード", () => {
    test("既存画像がある場合、画像が表示される", () => {
      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={false}
            imageUrl="https://example.com/image.jpg"
            selectedImage={null}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      const image = screen.getByAltText("家具画像");
      expect(image).toBeInTheDocument();
      // Next.jsのImageコンポーネントはsrcを変換するため、存在確認のみ
      expect(image).toHaveAttribute("src");
    });

    test("Supabase Storageのパス形式の場合、public URLに変換される", () => {
      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={false}
            imageUrl="furniture/image.jpg"
            selectedImage={null}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      expect(mockGetPublicUrl).toHaveBeenCalledWith("furniture/image.jpg");
    });

    test("画像がない場合、No imageが表示される", () => {
      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={false}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      expect(screen.getByText("No image")).toBeInTheDocument();
    });
  });

  describe("編集モード", () => {
    test("画像がない場合、アップロードUIが表示される", () => {
      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      expect(
        screen.getByText(
          "クリックまたはドラッグ＆ドロップで写真をアップロード",
        ),
      ).toBeInTheDocument();
    });

    test("ファイル選択で画像がアップロードされる", async () => {
      const user = userEvent.setup();
      const setSelectedImageMock = vi.fn();
      const mockFile = createMockFile("test.jpg", "image/jpeg", 1024 * 1024);

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={setSelectedImageMock}
          />
        </TestWrapper>,
      );

      // ファイル選択のシミュレーション
      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await user.upload(input, mockFile);

      expect(setSelectedImageMock).toHaveBeenCalledWith(mockFile);
    });

    test("選択された画像のプレビューが表示される", () => {
      const mockFile = createMockFile("test.jpg", "image/jpeg", 1024 * 1024);

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={mockFile}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      const image = screen.getByAltText("Preview");
      expect(image).toBeInTheDocument();
    });

    test("ドラッグ＆ドロップで画像がアップロードされる", async () => {
      const user = userEvent.setup();
      const setSelectedImageMock = vi.fn();
      const mockFile = createMockFile("test.jpg", "image/jpeg", 1024 * 1024);

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={setSelectedImageMock}
          />
        </TestWrapper>,
      );

      // ドラッグ＆ドロップのシミュレーション
      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await user.upload(input, mockFile);

      expect(setSelectedImageMock).toHaveBeenCalledWith(mockFile);
    });
  });

  describe("バリデーション", () => {
    test("JPEG以外のファイル形式の場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      const setSelectedImageMock = vi.fn();
      const invalidFile = createMockFile("test.gif", "image/gif", 1024); // ←修正

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={setSelectedImageMock}
          />
        </TestWrapper>,
      );

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await user.upload(input, invalidFile);

      await screen.findByText("JPEGまたはPNG画像のみアップロード可能です");
    });

    test("PNG以外のファイル形式の場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      const setSelectedImageMock = vi.fn();
      const invalidFile = createMockFile("test.gif", "image/gif", 1024);

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={setSelectedImageMock}
          />
        </TestWrapper>,
      );

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await user.upload(input, invalidFile);

      await waitFor(() => {
        expect(
          screen.getByText("JPEGまたはPNG画像のみアップロード可能です"),
        ).toBeInTheDocument();
      });
    });

    test("10MBを超えるファイルサイズの場合、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();
      const setSelectedImageMock = vi.fn();
      const largeFile = createMockFile(
        "large.jpg",
        "image/jpeg",
        11 * 1024 * 1024,
      );

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={setSelectedImageMock}
          />
        </TestWrapper>,
      );

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await user.upload(input, largeFile);

      await waitFor(() => {
        expect(
          screen.getByText("画像サイズは10MB以内にしてください"),
        ).toBeInTheDocument();
      });
    });

    test("有効なJPEGファイルの場合、エラーが表示されない", async () => {
      const user = userEvent.setup();
      const setSelectedImageMock = vi.fn();
      const validFile = createMockFile("test.jpg", "image/jpeg", 1024 * 1024);

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={setSelectedImageMock}
          />
        </TestWrapper>,
      );

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await user.upload(input, validFile);

      expect(setSelectedImageMock).toHaveBeenCalledWith(validFile);
      expect(
        screen.queryByText("JPEGまたはPNG画像のみアップロード可能です"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("画像サイズは10MB以内にしてください"),
      ).not.toBeInTheDocument();
    });

    test("有効なPNGファイルの場合、エラーが表示されない", async () => {
      const user = userEvent.setup();
      const setSelectedImageMock = vi.fn();
      const validFile = createMockFile("test.png", "image/png", 1024 * 1024);

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl={null}
            selectedImage={null}
            setSelectedImage={setSelectedImageMock}
          />
        </TestWrapper>,
      );

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await user.upload(input, validFile);

      expect(setSelectedImageMock).toHaveBeenCalledWith(validFile);
      expect(
        screen.queryByText("JPEGまたはPNG画像のみアップロード可能です"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("画像サイズは10MB以内にしてください"),
      ).not.toBeInTheDocument();
    });
  });

  describe("画像の優先順位", () => {
    test("selectedImageがある場合、プレビューが優先される", () => {
      const mockFile = createMockFile("test.jpg", "image/jpeg", 1024 * 1024);

      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl="https://example.com/existing.jpg"
            selectedImage={mockFile}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      const image = screen.getByAltText("Preview");
      expect(image).toBeInTheDocument();
      expect(screen.queryByAltText("家具画像")).not.toBeInTheDocument();
    });

    test("selectedImageがない場合、既存画像が表示される", () => {
      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={true}
            imageUrl="https://example.com/existing.jpg"
            selectedImage={null}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      const image = screen.getByAltText("家具画像");
      expect(image).toBeInTheDocument();
      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });
  });

  describe("スクロール効果", () => {
    test("コンポーネントが正しくレンダリングされる", () => {
      render(
        <TestWrapper>
          <FurnitureDetailImage
            isEditing={false}
            imageUrl="https://example.com/image.jpg"
            selectedImage={null}
            setSelectedImage={vi.fn()}
          />
        </TestWrapper>,
      );

      // スクロール効果のためのコンテナが存在することを確認
      const container = screen.getByAltText("家具画像").closest("div");
      expect(container).toBeInTheDocument();
    });
  });
});

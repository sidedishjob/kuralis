import type { SentMessageInfo } from "nodemailer";

const { createTransportMock, sendMailMock } = vi.hoisted(() => ({
  createTransportMock: vi.fn(),
  sendMailMock: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

function createRequest(body: Record<string, string>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.EMAIL_USER = "noreply@example.com";
    process.env.EMAIL_PASS = "dummy-pass";
    process.env.EMAIL_TO = "admin@example.com";

    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  test("2通のメール送信が成功した場合は200を返す", async () => {
    sendMailMock.mockResolvedValue({} as SentMessageInfo);

    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(
      createRequest({
        name: "テスト太郎",
        email: "user@example.com",
        subject: "お問い合わせ",
        message: "本文です",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: "送信成功" });
    expect(sendMailMock).toHaveBeenCalledTimes(2);
  });

  test("どちらか一方のメール送信が失敗した場合は500を返す", async () => {
    sendMailMock
      .mockResolvedValueOnce({} as SentMessageInfo)
      .mockRejectedValueOnce(new Error("smtp error"));

    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(
      createRequest({
        name: "テスト太郎",
        email: "user@example.com",
        subject: "お問い合わせ",
        message: "本文です",
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "メール送信中にエラーが発生しました",
    });
    expect(sendMailMock).toHaveBeenCalledTimes(2);
  });

  test("バリデーションエラーの場合は400を返し送信しない", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(
      createRequest({
        name: "",
        email: "invalid-mail",
        subject: "",
        message: "",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "バリデーションエラー",
    });
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});

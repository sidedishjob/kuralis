import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const result = contactSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json({ error: "バリデーションエラー" }, { status: 400 });
		}

		const { name, email, subject, message } = result.data;

		// Nodemailer設定
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// === 運営向け通知メール ===
		const adminSubject = `【kuralisお問い合わせ】${subject}（${name}様より）`;
		const adminText = `
▼ お問い合わせを受け付けました

【お名前】
${name}

【メールアドレス】
${email}

【件名】
${subject}

【メッセージ】
${message}

---
		`.trim();

		await transporter.sendMail({
			from: `"kuralis お問い合わせ" <${process.env.EMAIL_USER}>`,
			to: process.env.EMAIL_TO,
			replyTo: email,
			subject: adminSubject,
			text: adminText,
		});

		// === 自動返信メール ===
		const userSubject = `【kuralis】お問い合わせありがとうございます`;
		const userText = `
${name} 様

この度は「kuralis」へお問い合わせいただき、誠にありがとうございます。
以下の内容で受け付けました。担当より折り返しご連絡いたしますので、しばらくお待ちください。

＝＝＝＝＝＝＝＝＝＝＝＝
【件名】
${subject}

【メッセージ】
${message}
＝＝＝＝＝＝＝＝＝＝＝＝

※本メールは送信専用アドレスからの自動送信です。返信には対応しておりません。
		`.trim();

		await transporter.sendMail({
			from: `"kuralis" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: userSubject,
			text: userText,
		});

		return NextResponse.json({ message: "送信成功" }, { status: 200 });
	} catch (error) {
		console.error("メール送信エラー:", error);
		return NextResponse.json({ error: "メール送信中にエラーが発生しました" }, { status: 500 });
	}
}

export const fetcher = (url: string) =>
	fetch(url).then((res) => {
		if (!res.ok) throw new Error("データ取得に失敗しました");
		return res.json();
	});

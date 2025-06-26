# フォームポリシー

## 基本方針

- React Hook Formによるフォーム管理
- Zodによる型安全なバリデーション
- コンポーネントの再利用性・アクセシビリティ重視
- エラーハンドリングの統一

## フォームコンポーネントの構造

### 基本構造

```typescript
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function MyForm() {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ... },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}
```

### フィールドコンポーネント

```typescript
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function MyField({ name, label, required, ...props }) {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <Label htmlFor={name}>{label}{required && <span aria-hidden="true">*</span>}</Label>
      <Input id={name} {...register(name)} aria-required={required} {...props} />
      {errors[name] && <span role="alert">{errors[name].message}</span>}
    </div>
  );
}
```

## 命名規則

- フォーム: `[Entity]Form`（例: FurnitureForm, MaintenanceTaskForm）
- フィールド: `[Entity]Field`（例: FurnitureNameField）
- スキーマ: `[entity]Schema`（例: furnitureSchema）
- フィールド名はキャメルケース・意味のある名前・一貫性

## フォームの実装例

### 家具登録フォーム

```typescript
function FurnitureForm() {
  const methods = useForm({
    resolver: zodResolver(furnitureSchema),
    defaultValues: { ... },
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FurnitureNameField />
        <FurnitureBrandField />
        <FurnitureCategoryField />
        <FurnitureLocationField />
        <FurnitureImageField />
        <FurniturePurchaseDateField />
        <FurniturePurchaseFromField />
        <FurnitureNotesField />
        <Button type="submit">登録</Button>
      </form>
    </FormProvider>
  );
}
```

### メンテナンスタスクフォーム

```typescript
function MaintenanceTaskForm() {
  const methods = useForm({
    resolver: zodResolver(maintenanceTaskSchema),
    defaultValues: { ... },
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <MaintenanceTaskNameField />
        <MaintenanceCycleField />
        <MaintenanceDescriptionField />
        <Button type="submit">登録</Button>
      </form>
    </FormProvider>
  );
}
```

## エラーハンドリング

- 共通エラー表示: `ErrorMessage`コンポーネント（API/SWR/フォームエラー）
- フィールドエラー: `<span role="alert">{errors[name].message}</span>`
- 必須フィールド: `<span aria-hidden="true">*</span>` + `aria-required`属性

## アクセシビリティ

- input/label/textarea/buttonは全てアクセシブルなprops・aria属性を付与
- 必須・エラー・説明文は明示的に表示
- ボタンは`type`属性・disabled制御・ローディング表示（LoadingButton）

## パフォーマンス最適化

- フィールドは`React.memo`でメモ化可能
- バリデーションは`mode: "onBlur"`や`reValidateMode: "onChange"`で最適化

---

- フォーム構造・命名・アクセシビリティ・エラーハンドリングはすべて実装に統一。
- input/label/textarea/button/ErrorMessage/RequiredField等の実装例も実装通りに記載。

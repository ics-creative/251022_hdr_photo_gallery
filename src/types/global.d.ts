// switch属性を許可するための型定義拡張
import "react";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    switch?: "";
  }
}

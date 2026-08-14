## 开发注意事项

### 项目文件目录说明

以下为项目初始结构，你可以根据项目实际需求进行调整和补充。

```text
├─ prisma prisma ORM
├─ scripts 一些开发用脚本
├─ src 项目源代码目录
│  ├─ main.ts 主入口文件
│  ├─ generated 开发时自动生成的文件，例如prisma-client，不可更改其中任何内容
│  ├─ lib 公共函数库
│  │  ├─ prisma.ts prisma连接实例
│  ├─ routes 服务路由文件夹
```

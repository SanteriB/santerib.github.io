# example structure

```{
  [chapterId: string]: {
    title: string,
    content: string,
    options: []{
      optionText: string,
      conditions: {
        requiredEvents: string[],
        requiredItems: {
          itemName: string,
          quantity: number,
          operator: "<" | "<=" | ">" | ">=" | "=",
        }[],
      },
      nextChapterId: string,
    },
  }
}```

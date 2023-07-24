export interface IBeaten {
    Update(...params): void;
    Enter(...params): void;
    OnBeaten(): void;
}
export class DownloadTask
{
    private _total: number = 0;
    private _count: number = 0;
    public constructor()
    {
    
    }
    // 获取下载进度
    public GetProgress()
    {
        return this._count / this._total;
    }
}
export interface StoragePutOptions {
    contentType?: string
    cacheControl?: string
}

export interface StorageAdapter {
    put(objectKey: string, data: ArrayBuffer | Blob, options?: StoragePutOptions): Promise<{ url: string }>
    getSignedUrl(objectKey: string, expiresInSeconds: number): Promise<string>
    delete(objectKey: string): Promise<void>
}

export class SupabaseStorageAdapter implements StorageAdapter {
    constructor(private restUrl: string, private serviceKey: string, private bucket: string) { }

    async put(_objectKey: string, _data: ArrayBuffer | Blob, _options?: StoragePutOptions): Promise<{ url: string }> {
        // Placeholder implementation to satisfy interface; implement via Supabase Storage
        return { url: '' }
    }

    async getSignedUrl(_objectKey: string, _expiresInSeconds: number): Promise<string> {
        // Placeholder implementation to satisfy interface
        return ''
    }

    async delete(_objectKey: string): Promise<void> {
        // Placeholder implementation
        return
    }
}

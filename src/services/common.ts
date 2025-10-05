import { ApiService } from './api'
import type { ResType } from './types'

export type CheckResult = {
  exists: boolean
}

export type UploadImageData = {
  filePath: string
  category?: string
}

export type UploadVideoData = {
  filePath: string
  category?: string
  description?: string
}

export type UploadFileData = {
  filePath: string
  type?: string
}

export type UploadBatchFilesData = {
  files: Array<{ filePath: string; fileName?: string }>
  type?: string
}

export type UploadedFileInfo = {
  fileUrl: string
  fileName: string
}

export const checkGroupId = (id: number | string): Promise<ResType<CheckResult>> => {
  return ApiService.get<CheckResult>(`/check/gid/${id}`)
}

export const checkPostId = (id: number | string): Promise<ResType<CheckResult>> => {
  return ApiService.get<CheckResult>(`/check/pid/${id}`)
}

export const checkUserId = (id: number | string): Promise<ResType<CheckResult>> => {
  return ApiService.get<CheckResult>(`/check/uid/${id}`)
}

export const uploadImage = (data: UploadImageData): Promise<ResType<unknown>> => {
  const formData = data.category ? { category: data.category } : undefined
  return ApiService.uploadFile(data.filePath, '/oss/image', 'file', formData)
}

export const uploadVideo = (data: UploadVideoData): Promise<ResType<unknown>> => {
  const formData: Record<string, unknown> = {}
  if (data.category) formData.category = data.category
  if (data.description) formData.description = data.description
  return ApiService.uploadFile(data.filePath, '/oss/video', 'file', formData)
}

export const uploadFile = (data: UploadFileData): Promise<ResType<{ fileUrl: string }>> => {
  const formData = data.type ? { type: data.type } : undefined
  return ApiService.uploadFile<{ fileUrl: string }>(data.filePath, '/upload', 'file', formData)
}

export const uploadBatchFiles = async (data: UploadBatchFilesData): Promise<ResType<UploadedFileInfo[]>> => {
  const result: UploadedFileInfo[] = []

  for (const file of data.files) {
    const response = await ApiService.uploadFile<UploadedFileInfo | UploadedFileInfo[]>(
      file.filePath,
      '/upload/batch',
      'files',
      data.type ? { type: data.type } : undefined
    )

    if (response.code === 0 && response.data) {
      const payload = response.data
      if (Array.isArray(payload)) {
        payload.forEach(item => {
          if (item && typeof item === 'object') {
            result.push({
              fileUrl: String(item.fileUrl),
              fileName: String(item.fileName ?? '')
            })
          }
        })
      } else {
        result.push({
          fileUrl: String(payload.fileUrl),
          fileName: String(payload.fileName ?? file.fileName ?? '')
        })
      }
    }
  }

  return {
    code: result.length ? 0 : 1,
    msg: result.length ? '上传成功' : '上传失败',
    data: result
  }
}

export const gOperators = (model: string): Promise<ResType<string[]>> => {
  return ApiService.get<string[]>('/operators', {
    model,
    page: 1,
    limit: 999
  })
}

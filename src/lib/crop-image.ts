export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<File | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  // Calculate bounding box of the rotated image
  const rotRad = (rotation * Math.PI) / 180
  const width = image.width
  const height = image.height
  const { abs, cos, sin } = Math
  const boundingBoxWidth = abs(width * cos(rotRad)) + abs(height * sin(rotRad))
  const boundingBoxHeight = abs(width * sin(rotRad)) + abs(height * cos(rotRad))

  canvas.width = boundingBoxWidth
  canvas.height = boundingBoxHeight

  ctx.translate(boundingBoxWidth / 2, boundingBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.translate(-width / 2, -height / 2)
  ctx.drawImage(image, 0, 0)

  // Extract the cropped image
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.putImageData(data, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(new File([file], 'cropped-image.jpeg', { type: 'image/jpeg' }))
      } else {
        reject(new Error('Canvas is empty'))
      }
    }, 'image/jpeg', 0.9)
  })
}

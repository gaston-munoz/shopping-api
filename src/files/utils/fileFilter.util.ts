export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    const allowedExt = [ 'jpeg', 'jpg', 'png', 'gif', 'webp' ]

    const fileExtension = file && file.mimetype.split('/')[1]
    if (allowedExt.includes(fileExtension)) {
        callback(null, true)
    }

    callback(null, false)
}
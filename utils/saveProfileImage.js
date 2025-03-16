import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

// Convert `import.meta.url` to directory path (since `__dirname` is not available in ESM)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const saveProfileImage = async (googleProfilePic, userId) => {
    try {
        const response = await fetch(googleProfilePic)
        if (!response.ok) throw new Error('Failed to fetch image')

        const buffer = await response.arrayBuffer()
        const filePath = path.join(
            __dirname,
            '../public/images/profiles',
            `${userId}.jpg`,
        )

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true })

        // Save the image
        fs.writeFileSync(filePath, Buffer.from(buffer))

        console.log('Profile picture saved:', filePath)
        return `/images/profiles/${userId}.jpg` // Return relative path
    } catch (error) {
        console.error('Error saving profile image:', error)
        return googleProfilePic // Use original URL if saving fails
    }
}

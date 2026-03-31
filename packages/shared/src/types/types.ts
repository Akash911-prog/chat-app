export type PublicUser = {
    id: string
    username: string
    publicKey: string
    createdAt: Date
}

export type PublicRoom = {
    id: string
    userAId: string
    userBId: string
    createdAt: Date
}

export type PublicMessage = {
    id: string
    roomId: string
    senderId: string
    cipherText: string
    iv: string
    sentAt: Date
}
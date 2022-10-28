export interface SharedWithMeFileType extends Base {
    [x: string]: string | number | boolean | {} | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray | ReactPortal
    IsSigned: string,
    access: string,
    is_editable: boolean,
    isupdated: boolean,
    isdeleted: boolean,
    fileId: FileType,
    receiverId: UserType,
    senderId: UserType
}

export interface FileType extends Base {
    file_url: string,
    filename: string,
    docname: string,
    is_editable: boolean,
    isupdated: boolean,
    isdeleted: boolean,
    fileConsumers: [any],
    owner: UserType
}

export interface UserType extends Base {
    firstname: string,
    lastname: string,
    fullname?: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    role?: string,
    token?: string
}

export interface Base {
    _id: string,
    id?: string,
    createdAt: string,
    updatedAt: string
}
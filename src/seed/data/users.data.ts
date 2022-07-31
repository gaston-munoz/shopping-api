interface User {
    fullName: string;
    password: string;
    email: string;
    roles: string[];
    isActive: boolean;
}

export const users: User[] = [
        {
            fullName: 'Gaston M',
            password: '1234',
            email: 'cgm@gmail.com',
            roles: ['user', 'admin'],
            isActive: true,
        },
        {
            fullName: 'Tomas M',
            password: '1234',
            email: 'tom@gmail.com',
            roles: ['user', 'super-user'],
            isActive: true,
        },
   ]
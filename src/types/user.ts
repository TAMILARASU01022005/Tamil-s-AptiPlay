export interface User {
   id: string;
   name: string | null;
   email: string;
   emailVerified?: boolean | Date | null;
   createdAt?: Date;
   updatedAt?: Date;
   image?: string | null | undefined;
}
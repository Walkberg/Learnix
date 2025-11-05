export class UserDto {
  id: string;
  displayName: string;
  email: string;
  role: string;
  createdAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

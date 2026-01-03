import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Enum for service plan type
 * Defines possible service plans for users
 */
export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS = 'business',
}

/**
 * Enum for account status
 * Defines account activity status for users
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * Enum for user role
 * Defines user access level and permissions
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * User Entity - Represents the user table in the database
 * This class defines the structure and behavior of user data
 */
@Entity('users')
export class User {
  /**
   * Unique ID for the user
   * Automatically generated as auto increment
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * Full name of the user (required)
   * Cannot be null
   */
  @Column({ nullable: false })
  fullName: string;

  /**
   * Phone number of the user (optional)
   * Can be null, can be unique if provided
   */
  @Column({ nullable: true, unique: true, default: null })
  phoneNumber: string;

  /**
   * Email address of the user (optional)
   * Must be unique
   */
  @Column({ unique: true, nullable: true })
  email: string;

  /**
   * Address of the user (optional)
   * Can be null, uses text type to store long addresses
   */
  @Column({ nullable: true, type: 'text', default: null })
  address: string;

  /**
   * Avatar URL of the user (optional)
   * Path to profile image file, can be null
   */
  @Column({ nullable: true, default: null })
  avatarUrl: string;

  /**
   * User password (hashed) (optional for OAuth users)
   * Can be null for OAuth users, encrypted using bcrypt for regular users
   */
  @Column({ nullable: true, default: null })
  password: string;

  /**
   * Google ID for OAuth authentication
   * Used to identify users who login via Google
   */
  @Column({ nullable: true, unique: true, default: null })
  googleId: string;

  /**
   * Facebook ID for OAuth authentication
   * Used to identify users who login via Facebook
   */
  @Column({ nullable: true, unique: true, default: null })
  facebookId: string;

  /**
   * Provider used for authentication
   * Can be: local, google, facebook
   */
  @Column({ nullable: true, default: 'local' })
  provider: string;

  /**
   * Service plan type of the user
   * Default is 'free', can be: free, pro, business
   */
  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.FREE,
  })
  planType: PlanType;

  /**
   * Account status of the user
   * Default is 'active', can be: active, inactive
   */
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  /**
   * Role of the user
   * Default is 'user', can be: user, admin
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  /**
   * Last updated password time
   */
  @Column({ nullable: true, default: null })
  lastUpdatedPassword: Date;

  /**
   * Account creation time
   * Automatically managed by TypeORM
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Last update time
   * Automatically managed by TypeORM
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Automatically encrypt password before saving to database
   * Uses bcrypt with salt round of 10
   * Only hash if password exists (for OAuth users, password can be null)
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && (this.provider === 'local' || !this.provider)) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  /**
   * Validate if the user-provided password matches the stored hash
   * @param password - Plain text password for validation
   * @returns Promise<boolean> - True if password matches, false otherwise
   */
  async validatePassword(password: string): Promise<boolean> {
    if (!this.password || this.provider !== 'local') {
      return false; // OAuth users cannot login with password
    }
    return bcrypt.compare(password, this.password);
  }

  /**
   * Check if the account is currently active
   * @returns boolean - True if status is active
   */
  isAccountActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if the user has pro or business plan
   * @returns boolean - True if has premium plan
   */
  isPremiumUser(): boolean {
    return this.planType === PlanType.PRO || this.planType === PlanType.BUSINESS;
  }

  /**
   * Check if the user is an admin
   * @returns boolean - True if role is admin
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Check if the user has admin privileges
   * @returns boolean - True if user has admin role
   */
  hasAdminPrivileges(): boolean {
    return this.isAdmin();
  }
}

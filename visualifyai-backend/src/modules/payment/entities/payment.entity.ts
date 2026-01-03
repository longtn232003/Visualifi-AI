import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

/**
 * Enum for payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

/**
 * Payment Entity - Represents payment bills uploaded by users
 */
@Entity('payments')
export class Payment {
  /**
   * Unique ID for the payment
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * Reference to the user who uploaded the bill
   */
  @Column()
  userId: number;

  /**
   * Amount paid by user
   */
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  /**
   * Bill/Receipt image path
   */
  @Column()
  billImagePath: string;

  /**
   * Payment status
   */
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  /**
   * Unique confirmation token for admin verification
   */
  @Column({ unique: true })
  confirmationToken: string;

  /**
   * Admin who confirmed the payment
   */
  @Column({ nullable: true })
  confirmedByAdminId: number;

  /**
   * Time when payment was confirmed
   */
  @Column({ nullable: true })
  confirmedAt: Date;

  /**
   * Admin's note/comment
   */
  @Column({ type: 'text', nullable: true })
  adminNote: string;

  /**
   * Creation time
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Last update time
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relationship with User entity
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Relationship with Admin User entity
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'confirmedByAdminId' })
  confirmedByAdmin: User;

  /**
   * Check if payment is pending
   */
  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  /**
   * Check if payment is confirmed
   */
  isConfirmed(): boolean {
    return this.status === PaymentStatus.CONFIRMED;
  }

  /**
   * Check if payment is rejected
   */
  isRejected(): boolean {
    return this.status === PaymentStatus.REJECTED;
  }
}

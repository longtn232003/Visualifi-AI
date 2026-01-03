import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { InfographicInput } from './infographic-input.entity';

/**
 * Enum for processing status
 * Defines the current state of infographic generation
 */
export enum ProcessingStatus {
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

/**
 * InfographicResult Entity - Represents AI-generated infographic results
 * Simplified version matching the SQL schema
 */
@Entity('infographic_generated')
export class InfographicGenerated {
  /**
   * Unique ID for the result
   * Auto increment primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Reference to the user who owns this result
   */
  @Column()
  userId: number;

  /**
   * Reference to the input that generated this result
   */
  @Column()
  inputId: number;

  /**
   * Processing status of the infographic generation
   */
  @Column({
    type: 'enum',
    enum: ProcessingStatus,
    default: ProcessingStatus.PROCESSING,
  })
  status: ProcessingStatus;

  /**
   * Path to the generated infographic image
   */
  @Column({ nullable: true })
  imagePath: string;

  /**
   * Whether the image has watermark
   * True for free users, false for premium users
   */
  @Column({ default: true })
  watermarked: boolean;

  /**
   * Result creation time
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Result update time
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relationship with InfographicInput entity
   */
  @OneToOne(() => InfographicInput, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inputId' })
  input: InfographicInput;

  /**
   * Relationship with User entity
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Check if the result is ready for download
   */
  isReadyForDownload(): boolean {
    return this.status === ProcessingStatus.COMPLETED && !!this.imagePath;
  }

  /**
   * Check if the result has failed
   */
  hasFailed(): boolean {
    return this.status === ProcessingStatus.FAILED;
  }

  /**
   * Check if the result is still processing
   */
  isProcessing(): boolean {
    return this.status === ProcessingStatus.PROCESSING;
  }
}

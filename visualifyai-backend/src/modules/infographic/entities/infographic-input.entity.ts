import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

/**
 * Enum for input type
 * Defines the type of input provided by user
 */
export enum InputType {
  TEXT = 'Text',
  FILE = 'File',
}

export enum InfographicStyle {
  SIMPLE = 'simple',
  MODERN = 'modern',
  CLASSIC = 'classic',
  MINIMALIST = 'minimalistic',
  ARTISTIC = 'artistic',
}

export enum InfographicSize {
  SIZE_11 = '1:1',
  SIZE_23 = '2:3',
  SIZE_32 = '3:2',
}

/**
 * InfographicInput Entity - Represents user inputs for infographic generation
 * Simplified version matching the SQL schema
 */
@Entity('infographic_inputs')
export class InfographicInput {
  /**
   * Unique ID for the input
   * Auto increment primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Reference to the user who created this input
   */
  @Column()
  userId: number;

  /**
   * Type of input: Text or File
   */
  @Column({
    type: 'enum',
    enum: InputType,
    nullable: false,
  })
  inputType: InputType;

  /**
   * Style of infographic
   */
  @Column({
    type: 'enum',
    enum: InfographicStyle,
    nullable: false,
    default: InfographicStyle.SIMPLE,
  })
  style: InfographicStyle;

  /**
   * Size of infographic
   */
  @Column({
    type: 'enum',
    enum: InfographicSize,
    default: InfographicSize.SIZE_11,
  })
  size: InfographicSize;

  /**
   * Text prompt for infographic generation
   */
  @Column({ type: 'text', nullable: true })
  prompt: string;

  /**
   * File path (for file input type)
   * Nullable if input type is text
   */
  @Column({ nullable: true })
  filePath: string;

  /**
   * Input creation time
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Input update time
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relationship with User entity
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

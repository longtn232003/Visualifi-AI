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
import { InfographicGenerated } from './infographic-generated.entity';

/**
 * InfographicStorage Entity - Represents user's saved infographics in their storage
 * This is separate from InfographicGenerated to distinguish between generated and saved items
 */
@Entity('infographic_storage')
export class InfographicStorage {
  /**
   * Unique ID for the saved infographic
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Reference to the user who saved this infographic
   */
  @Column()
  userId: number;

  /**
   * Reference to the original generated infographic
   */
  @Column()
  infographicId: number;

  /**
   * title given by user (optional, can override original title)
   */
  @Column({ nullable: false, default: '' })
  title: string;

  /**
   * description/notes added by user
   */
  @Column({ type: 'text', nullable: true, default: '' })
  description: string;

  /**
   * Creation time when saved to storage
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
   * Relationship with InfographicGeneration entity
   */
  @ManyToOne(() => InfographicGenerated, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'infographicId' })
  infographic: InfographicGenerated;
}

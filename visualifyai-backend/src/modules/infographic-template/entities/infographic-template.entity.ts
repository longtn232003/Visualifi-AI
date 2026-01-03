import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * InfographicTemplate Entity - Represents template imported by admin
 */
@Entity('infographic_template')
export class InfographicTemplate {
  /**
   * Unique ID for the template
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Template title
   */
  @Column({ nullable: false })
  title: string;

  /**
   * Template description
   */
  @Column({ type: 'text', nullable: true, default: '' })
  description: string;

  /**
   * Template category
   */
  @Column({ nullable: false, default: '' })
  category: string;

  /**
   * Template image path
   */
  @Column({ nullable: false })
  imagePath: string;

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
}

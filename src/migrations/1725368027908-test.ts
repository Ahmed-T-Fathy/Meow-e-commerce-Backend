import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1725368027908 implements MigrationInterface {
    name = 'Test1725368027908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "comment" TO "commen"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "commen" TO "comment"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "commen" character varying`);
        await queryRunner.query(`ALTER TABLE "review" ADD "comment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "commen"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "comment" character varying`);
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "comment" TO "commen"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "commen" TO "comment"`);
    }

}

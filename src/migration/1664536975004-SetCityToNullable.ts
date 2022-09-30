import { MigrationInterface, QueryRunner } from "typeorm";

export class SetCityToNullable1664536975004 implements MigrationInterface {
    name = 'SetCityToNullable1664536975004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact_info\` DROP COLUMN \`city\``);
        await queryRunner.query(`ALTER TABLE \`contact_info\` ADD \`city\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact_info\` DROP COLUMN \`city\``);
        await queryRunner.query(`ALTER TABLE \`contact_info\` ADD \`city\` varchar(255) NOT NULL`);
    }

}

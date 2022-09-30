import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCityToContactInfo1664535469953 implements MigrationInterface {
    name = 'AddCityToContactInfo1664535469953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact_info\` ADD \`city\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact_info\` DROP COLUMN \`city\``);
    }

}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250627090258 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reservation ADD travel_id INT NOT NULL');
        $this->addSql('ALTER TABLE reservation ALTER reservation_date TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955ECAB15B3 FOREIGN KEY (travel_id) REFERENCES travel (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_42C84955ECAB15B3 ON reservation (travel_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955ECAB15B3');
        $this->addSql('DROP INDEX IDX_42C84955ECAB15B3');
        $this->addSql('ALTER TABLE reservation DROP travel_id');
        $this->addSql('ALTER TABLE reservation ALTER reservation_date TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
    }
}

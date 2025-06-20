<?php

namespace App\Repository;

use App\Entity\Guide;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Guide>
 */
class GuideRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Guide::class);
    }

    public function findActive(): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('g.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByCountry(string $country): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.country = :country')
            ->andWhere('g.isActive = :active')
            ->setParameter('country', $country)
            ->setParameter('active', true)
            ->orderBy('g.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByEmail(string $email): ?Guide
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
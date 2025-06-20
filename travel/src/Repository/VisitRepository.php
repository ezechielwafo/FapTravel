<?php

namespace App\Repository;

use App\Entity\Visit;
use App\Entity\Guide;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Visit>
 */
class VisitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Visit::class);
    }

    public function findByMonth(int $year, int $month): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('YEAR(v.visitDate) = :year')
            ->andWhere('MONTH(v.visitDate) = :month')
            ->setParameter('year', $year)
            ->setParameter('month', $month)
            ->orderBy('v.visitDate', 'ASC')
            ->addOrderBy('v.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByGuideAndMonth(Guide $guide, int $year, int $month): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.guide = :guide')
            ->andWhere('YEAR(v.visitDate) = :year')
            ->andWhere('MONTH(v.visitDate) = :month')
            ->setParameter('guide', $guide)
            ->setParameter('year', $year)
            ->setParameter('month', $month)
            ->orderBy('v.visitDate', 'ASC')
            ->addOrderBy('v.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getVisitsByMonthStats(): array
    {
        return $this->createQueryBuilder('v')
            ->select('YEAR(v.visitDate) as year, MONTH(v.visitDate) as month, COUNT(v.id) as visitCount')
            ->groupBy('year, month')
            ->orderBy('year', 'DESC')
            ->addOrderBy('month', 'DESC')
            ->setMaxResults(12)
            ->getQuery()
            ->getResult();
    }

    public function getVisitsByGuideAndMonthStats(): array
    {
        return $this->createQueryBuilder('v')
            ->select('YEAR(v.visitDate) as year, MONTH(v.visitDate) as month, g.firstName, g.lastName, COUNT(v.id) as visitCount')
            ->leftJoin('v.guide', 'g')
            ->groupBy('year, month, g.id')
            ->orderBy('year', 'DESC')
            ->addOrderBy('month', 'DESC')
            ->addOrderBy('g.lastName', 'ASC')
            ->setMaxResults(50)
            ->getQuery()
            ->getResult();
    }

    public function getPresenceRateByMonth(): array
    {
        return $this->createQueryBuilder('v')
            ->select('YEAR(v.visitDate) as year, MONTH(v.visitDate) as month, 
                     COUNT(vi.id) as totalVisitors, 
                     SUM(CASE WHEN vi.isPresent = 1 THEN 1 ELSE 0 END) as presentVisitors')
            ->leftJoin('v.visitors', 'vi')
            ->groupBy('year, month')
            ->orderBy('year', 'DESC')
            ->addOrderBy('month', 'DESC')
            ->setMaxResults(12)
            ->getQuery()
            ->getResult();
    }

    public function findUpcomingForGuide(Guide $guide): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.guide = :guide')
            ->andWhere('v.visitDate >= :today')
            ->andWhere('v.isCompleted = :completed')
            ->setParameter('guide', $guide)
            ->setParameter('today', new \DateTime())
            ->setParameter('completed', false)
            ->orderBy('v.visitDate', 'ASC')
            ->addOrderBy('v.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findPastForGuide(Guide $guide): array
    {
        $today = new \DateTime();
        $today->setTime(23, 59, 59);

        return $this->createQueryBuilder('v')
            ->andWhere('v.guide = :guide')
            ->andWhere('v.visitDate < :today OR v.isCompleted = :completed')
            ->setParameter('guide', $guide)
            ->setParameter('today', $today)
            ->setParameter('completed', true)
            ->orderBy('v.visitDate', 'DESC')
            ->addOrderBy('v.startTime', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findTodayForGuide(Guide $guide): array
    {
        $today = new \DateTime();
        
        return $this->createQueryBuilder('v')
            ->andWhere('v.guide = :guide')
            ->andWhere('v.visitDate = :today')
            ->andWhere('v.isCompleted = :completed')
            ->setParameter('guide', $guide)
            ->setParameter('today', $today->format('Y-m-d'))
            ->setParameter('completed', false)
            ->orderBy('v.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
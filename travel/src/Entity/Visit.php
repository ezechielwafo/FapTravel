<?php

namespace App\Entity;

use App\Repository\VisitRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: VisitRepository::class)]
class Visit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photo = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    private ?string $country = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $location = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotBlank]
    private ?\DateTimeInterface $visitDate = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotBlank]
    private ?\DateTimeInterface $startTime = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Positive]
    private ?int $duration = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\ManyToOne(inversedBy: 'visits')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Guide $guide = null;

    /**
     * @var Collection<int, Visitor>
     */
    #[ORM\OneToMany(targetEntity: Visitor::class, mappedBy: 'visit', cascade: ['persist', 'remove'])]
    private Collection $visitors;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comment = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?bool $isCompleted = false;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->visitors = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getVisitDate(): ?\DateTimeInterface
    {
        return $this->visitDate;
    }

    public function setVisitDate(\DateTimeInterface $visitDate): static
    {
        $this->visitDate = $visitDate;

        return $this;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeInterface $startTime): static
    {
        $this->startTime = $startTime;
        $this->calculateEndTime();

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;
        $this->calculateEndTime();

        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(\DateTimeInterface $endTime): static
    {
        $this->endTime = $endTime;

        return $this;
    }

    private function calculateEndTime(): void
    {
        if ($this->startTime && $this->duration) {
            $start = clone $this->startTime;
            $this->endTime = $start->add(new \DateInterval('PT' . $this->duration . 'H'));
        }
    }

    public function getGuide(): ?Guide
    {
        return $this->guide;
    }

    public function setGuide(?Guide $guide): static
    {
        $this->guide = $guide;

        return $this;
    }

    /**
     * @return Collection<int, Visitor>
     */
    public function getVisitors(): Collection
    {
        return $this->visitors;
    }

    public function addVisitor(Visitor $visitor): static
    {
        if (!$this->visitors->contains($visitor)) {
            $this->visitors->add($visitor);
            $visitor->setVisit($this);
        }

        return $this;
    }

    public function removeVisitor(Visitor $visitor): static
    {
        if ($this->visitors->removeElement($visitor)) {
            // set the owning side to null (unless already changed)
            if ($visitor->getVisit() === $this) {
                $visitor->setVisit(null);
            }
        }

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function isCompleted(): ?bool
    {
        return $this->isCompleted;
    }

    public function setCompleted(bool $isCompleted): static
    {
        $this->isCompleted = $isCompleted;

        return $this;
    }

    public function getVisitorCount(): int
    {
        return $this->visitors->count();
    }

    public function canAddVisitor(): bool
    {
        return $this->getVisitorCount() < 15;
    }

    public function getStatus(): string
    {
        $now = new \DateTime();
        $visitDateTime = new \DateTime($this->visitDate->format('Y-m-d') . ' ' . $this->startTime->format('H:i:s'));
        $endDateTime = new \DateTime($this->visitDate->format('Y-m-d') . ' ' . $this->endTime->format('H:i:s'));

        if ($this->isCompleted) {
            return 'completed';
        }

        if ($now < $visitDateTime) {
            return 'upcoming';
        }

        if ($now > $endDateTime) {
            return 'past';
        }

        return 'ongoing';
    }

    public function getPresentVisitorsCount(): int
    {
        return $this->visitors->filter(fn($visitor) => $visitor->isPresent())->count();
    }

    public function getPresenceRate(): float
    {
        if ($this->getVisitorCount() === 0) {
            return 0;
        }

        return ($this->getPresentVisitorsCount() / $this->getVisitorCount()) * 100;
    }
}
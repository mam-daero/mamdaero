package com.mamdaero.domain.reservation.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationSymptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_symptom_id")
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
    private Long symptomId;

}

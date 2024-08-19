package com.mamdaero.domain.reservation.service;

import com.mamdaero.domain.code.repository.CodeRepository;
import com.mamdaero.domain.counselor_item.entity.CounselorItem;
import com.mamdaero.domain.counselor_item.exception.CounselorItemNotFoundException;
import com.mamdaero.domain.counselor_item.repository.CounselorItemRepository;
import com.mamdaero.domain.member.entity.Counselor;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.repository.CounselorRepository;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.reservation.dto.request.CreateReservationRequest;
import com.mamdaero.domain.reservation.dto.response.ReservationListResponse;
import com.mamdaero.domain.reservation.dto.response.ReservationResponse;
import com.mamdaero.domain.reservation.dto.response.SituationResponse;
import com.mamdaero.domain.reservation.dto.response.SymptomResponse;
import com.mamdaero.domain.reservation.entity.Reservation;
import com.mamdaero.domain.reservation.entity.ReservationSituation;
import com.mamdaero.domain.reservation.entity.ReservationSymptom;
import com.mamdaero.domain.reservation.exception.CanNotMakeReservationException;
import com.mamdaero.domain.reservation.exception.ReservationNotFoundException;
import com.mamdaero.domain.reservation.repository.ReservationRepository;
import com.mamdaero.domain.work_schedule.entity.WorkTime;
import com.mamdaero.domain.work_schedule.exception.WorkTimeNotfoundException;
import com.mamdaero.domain.work_schedule.repository.WorkTimeRepository;
import com.mamdaero.global.dto.Pagination;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final CounselorItemRepository counselorItemRepository;
    private final WorkTimeRepository workTimeRepository;
    private final FindUserService findUserService;
    private final CodeRepository codeRepository;
    private final CounselorRepository counselorRepository;

    @Transactional
    public void createReservation(CreateReservationRequest request) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("내담자")) {
            throw new AccessDeniedException();
        }

        // 존재하는 상담상품인지 확인;
        if (!counselorItemRepository.existsById(request.getCounselorItemId())) {
            throw new CounselorItemNotFoundException();
        }

        CounselorItem counselorItem = counselorItemRepository.findById(request.getCounselorItemId()).get();

        // 존재하는 근무시간인지 확인
        if (!workTimeRepository.existsById(request.getWorkTimeId())) {
            throw new WorkTimeNotfoundException();
        }


        WorkTime workTime = workTimeRepository.findById(request.getWorkTimeId()).get();

        System.out.println(workTime.getIsReserved());
        // 이미 예약된 시간이거나 근무시간이 아니라면 예약할 수 없다.
        if (workTime.getIsReserved() || !workTime.getIsWorkTime()) {
            throw new CanNotMakeReservationException();
        }

        workTime.reserve();

        Reservation reservation = Reservation.builder()
                .memberId(member.getMemberId())
                .counselorItemId(request.getCounselorItemId())
                .workTimeId(request.getWorkTimeId())
                .requirement(request.getRequirement())
                .isDiaryShared(request.getIsDiaryShared())
                .isTestShared(request.getIsTestShared())
                .itemName(counselorItem.getName())
                .itemFee(counselorItem.getFee())
                .symptoms(new ArrayList<>())
                .situations(new ArrayList<>())
                .build();


        for (Long symptomId : request.getSymptomIds()) {
            ReservationSymptom symptom = new ReservationSymptom();
            symptom.setSymptomId(symptomId);
            reservation.addSymptom(symptom);
        }

        for (Long situationId : request.getSituationIds()) {
            ReservationSituation situation = new ReservationSituation();
            situation.setSituationId(situationId);
            reservation.addSituation(situation);
        }
        reservationRepository.save(reservation);
    }

    @Transactional
    public void cancelReservation(Long reservationId) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !(member.getMemberRole().equals("내담자") || member.getMemberRole().equals("상담사"))) {
            throw new AccessDeniedException();
        }

        Optional<Reservation> findReservation = reservationRepository.findById(reservationId);

        if (findReservation.isEmpty()) {
            throw new ReservationNotFoundException();
        }

        Reservation reservation = findReservation.get();

        WorkTime workTime = workTimeRepository.findById(reservation.getWorkTimeId()).get();


        String role = member.getMemberRole();
        reservation.cancel(role);
        workTime.cancelReserve();

    }

    public Pagination<ReservationListResponse> getReservationList(int page, int size) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !(member.getMemberRole().equals("내담자") || member.getMemberRole().equals("상담사"))) {
            throw new AccessDeniedException();
        }

        String caller = member.getMemberRole();

        Pageable pageable = PageRequest.of(page, size);

        if ("내담자".equals(caller)) {
            Page<ReservationListResponse> reservationPage = reservationRepository.findByMemberId(member.getMemberId(), pageable);
            return new Pagination<ReservationListResponse>(
                    reservationPage.getContent(),
                    reservationPage.getNumber() + 1,
                    reservationPage.getTotalPages(),
                    reservationPage.getSize(),
                    (int) reservationPage.getTotalElements()

            );
        } else if ("상담사".equals(caller)) {
            Page<ReservationListResponse> reservationPage = reservationRepository.findByCounselorId(member.getMemberId(), pageable);
            return new Pagination<ReservationListResponse>(
                    reservationPage.getContent(),
                    reservationPage.getNumber() + 1,
                    reservationPage.getTotalPages(),
                    reservationPage.getSize(),
                    (int) reservationPage.getTotalElements()

            );
        } else {
            throw new RuntimeException("예약 목록 조회 권한이 없습니다.");
        }
    }

    public Pagination<ReservationListResponse> getConsult(int page, int size) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !(member.getMemberRole().equals("내담자") || member.getMemberRole().equals("상담사"))) {
            throw new AccessDeniedException();
        }

        String caller = member.getMemberRole();

        Pageable pageable = PageRequest.of(page, size);

        if ("내담자".equals(caller)) {
            Page<ReservationListResponse> reservationPage = reservationRepository.findByMemberIdComplete(member.getMemberId(), pageable);
            return new Pagination<ReservationListResponse>(
                    reservationPage.getContent(),
                    reservationPage.getNumber() + 1,
                    reservationPage.getTotalPages(),
                    reservationPage.getSize(),
                    (int) reservationPage.getTotalElements()

            );
        } else if ("상담사".equals(caller)) {
            Page<ReservationListResponse> reservationPage = reservationRepository.findByCounselorIdComplete(member.getMemberId(), pageable);
            return new Pagination<ReservationListResponse>(
                    reservationPage.getContent(),
                    reservationPage.getNumber() + 1,
                    reservationPage.getTotalPages(),
                    reservationPage.getSize(),
                    (int) reservationPage.getTotalElements()

            );
        } else {
            throw new RuntimeException("예약 목록 조회 권한이 없습니다.");
        }
    }

    @Transactional
    public ReservationResponse getReservation(Long reservationId) {

        Reservation reservation = reservationRepository.findReservationWithDetails(reservationId);

        WorkTime workTime = workTimeRepository.getReferenceById(reservation.getWorkTimeId());

        CounselorItem counselorItem = counselorItemRepository.getReferenceById(reservation.getCounselorItemId());

        Counselor counselor = counselorRepository.getReferenceById(counselorItem.getCounselorId());

        List<SituationResponse> situationResponses = reservation.getSituations().stream()
                .map(situation -> new SituationResponse(codeRepository.findCodeById(situation.getSituationId()).getName()))
                .collect(Collectors.toList());

        List<SymptomResponse> symptomResponses = reservation.getSymptoms().stream()
                .map(symptom -> new SymptomResponse(codeRepository.findCodeById(symptom.getSymptomId()).getName()))
                .collect(Collectors.toList());

        return new ReservationResponse(
                reservation.getId(),
                reservation.getMemberId(),
                counselor.getId(),
                workTime.getDate(),
                workTime.getTime(),
                reservation.getStatus(),
                reservation.getItemName(),
                reservation.getItemFee(),
                reservation.getCanceler(),
                reservation.getCanceledAt(),
                reservation.getRequirement(),
                reservation.getIsDiaryShared(),
                reservation.getIsTestShared(),
                situationResponses,
                symptomResponses
        );
    }

    @Transactional
    public void deleteConsult(Long consultId) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !(member.getMemberRole().equals("내담자") || member.getMemberRole().equals("상담사"))) {
            throw new AccessDeniedException();
        }

        Long memberId = member.getMemberId();

        Reservation reservation = reservationRepository.findByMemberIdAndId(memberId, consultId);

        if (reservation == null) {
            throw new ReservationNotFoundException();
        }

        reservationRepository.delete(reservation);
    }

    @Transactional
    public void updateState(Long reservationId) {
        MemberInfoDTO member = findUserService.findMember();
        if (member == null || !(member.getMemberRole().equals("상담사"))) {
            throw new AccessDeniedException();
        }

        CounselorItem counselorItem = counselorItemRepository.getReferenceById(reservationRepository.getReferenceById(reservationId).getCounselorItemId());

        Reservation reservation = reservationRepository.findByCounselorItemIdAndId(counselorItem.getCounselorItemId(), reservationId);

        if (reservation == null) {
            throw new ReservationNotFoundException();
        }

        reservation.update();
    }
}

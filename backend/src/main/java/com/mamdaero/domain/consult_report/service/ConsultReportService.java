package com.mamdaero.domain.consult_report.service;

import com.mamdaero.domain.consult.exception.ConsultNotFoundException;
import com.mamdaero.domain.consult.repository.ConsultRepository;
import com.mamdaero.domain.consult_report.dto.request.CreateConsultReportRequest;
import com.mamdaero.domain.consult_report.dto.request.UpdateConsultReportRequest;
import com.mamdaero.domain.consult_report.dto.response.ConsultReportDetailResponse;
import com.mamdaero.domain.consult_report.dto.response.ConsultReportListResponse;
import com.mamdaero.domain.consult_report.entity.ConsultReport;
import com.mamdaero.domain.consult_report.exception.ConsultReportAlreadyExistException;
import com.mamdaero.domain.consult_report.exception.ConsultReportBadRequestException;
import com.mamdaero.domain.consult_report.exception.ConsultReportNotFoundException;
import com.mamdaero.domain.consult_report.repository.ConsultReportRepository;
import com.mamdaero.domain.counselor_item.repository.CounselorItemRepository;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.reservation.repository.ReservationRepository;
import com.mamdaero.global.dto.Pagination;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConsultReportService {

    private final ConsultReportRepository consultReportRepository;
    private final ReservationRepository reservationRepository;
    private final CounselorItemRepository counselorItemRepository;
    private final ConsultRepository consultRepository;
    private final FindUserService findUserService;

    public Pagination<ConsultReportListResponse> getConsultReportListByClientId(Long clientId, int page, int size) {

        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        Long counselorId = member.getMemberId();

        Pageable pageable = PageRequest.of(page, size);

        Page<ConsultReportListResponse> listPage = consultReportRepository.findByClientIdAndCounselorId(clientId, counselorId, pageable);

        return new Pagination<>(
                listPage.getContent(),
                listPage.getNumber() + 1,
                listPage.getTotalPages(),
                listPage.getSize(),
                (int) listPage.getTotalElements()
        );
    }

    public ConsultReportDetailResponse findById(Long reportId) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        if (!consultReportRepository.existsById(reportId)) {
            throw new ConsultReportNotFoundException();
        }

        ConsultReportDetailResponse report = consultReportRepository.findReport(reportId);

        return report;
    }

    public void create(Long reportId, CreateConsultReportRequest request) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        //상담이 존재하지 않으면 보고서를 작성 불가
        if (!consultRepository.existsById(reportId)) {
            throw new ConsultNotFoundException();
        }

        // 이미보고서가 있을 경우 보고서 작성 불가
        if (consultReportRepository.existsById(reportId)) {
            throw new ConsultReportAlreadyExistException();
        }

        // 필수 필드 확인
        if (request.getTitle() == null || request.getDetail() == null) {
            throw new ConsultReportBadRequestException();
        }

        Long counselorId = member.getMemberId();
        Long counselorItemId = reservationRepository.findById(reportId).get().getCounselorItemId();

        // 상담사 자신의 상담이 아니면 보고서 작성 불가
        if (counselorItemRepository.findById(counselorItemId).get().getCounselorId() != counselorId) {
            throw new ConsultReportBadRequestException();
        }

        ConsultReport report = ConsultReport.builder()
                .id(reportId)
                .title(request.getTitle())
                .detail(request.getDetail())
                .opinion(request.getOpinion())
                .build();

        consultReportRepository.save(report);

    }

    @Transactional
    public void update(Long reportId, UpdateConsultReportRequest request) {
        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        // 보고서가 존재하지 않으면 수정 불가
        if (!consultReportRepository.existsById(reportId)) {
            throw new ConsultReportNotFoundException();
        }

        // 필수 필드 확인
        if (request.getTitle() == null || request.getDetail() == null) {
            throw new ConsultReportBadRequestException();
        }


        Long counselorId = member.getMemberId();
        Long counselorItemId = reservationRepository.findById(reportId).get().getCounselorItemId();

        // 상담사 자신의 상담이 아니면 보고서 작성 불가
        if (counselorItemRepository.findById(counselorItemId).get().getCounselorId() != counselorId) {
            throw new ConsultReportBadRequestException();
        }

        ConsultReport report = consultReportRepository.findById(reportId).get();
        report.update(request);

    }
}

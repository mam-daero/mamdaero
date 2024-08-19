package com.mamdaero.domain.consult.service;

import com.mamdaero.domain.consult.dto.response.ClientListResponse;
import com.mamdaero.domain.consult.entity.Consult;
import com.mamdaero.domain.consult.repository.ConsultRepository;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.reservation.exception.ReservationNotFoundException;
import com.mamdaero.domain.reservation.repository.ReservationRepository;
import com.mamdaero.global.dto.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ConsultService {
    private final ReservationRepository reservationRepository;
    private final ConsultRepository consultRepository;
    private final FindUserService findUserService;

    public void create(Long reservationId) {

        // 존재하는 예약인지 확인
        if (!reservationRepository.existsById(reservationId)) {
            throw new ReservationNotFoundException();
        }
        // 생성된 상담이 없다면 생성
        if (!consultRepository.existsById(reservationId)) {
            createConsult(reservationId);
        }

    }


    private void createConsult(Long reservationId) {
        Consult consult = new Consult(reservationId);
        consultRepository.save(consult);
    }

    public Pagination<ClientListResponse> findMyClientList(int page, int size, String name) {
        //TODO: 토큰으로부터 진짜 상담사ID 가져오기
        MemberInfoDTO member = findUserService.findMember();
        if (member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        Long counselorId = member.getMemberId();
        Pageable pageable = PageRequest.of(page, size);


        Page<ClientListResponse> clientList = consultRepository.findMyClientList(counselorId, name, pageable);

        return new Pagination<>(
                clientList.getContent(),
                clientList.getNumber() + 1,
                clientList.getTotalPages(),
                clientList.getSize(),
                (int) clientList.getTotalElements()

        );
    }
}

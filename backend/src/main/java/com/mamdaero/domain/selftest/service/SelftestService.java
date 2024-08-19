package com.mamdaero.domain.selftest.service;

import com.mamdaero.domain.member.entity.Member;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.selftest.dto.request.TestRequestDto;
import com.mamdaero.domain.selftest.dto.response.MemberSelftestResponseDto;
import com.mamdaero.domain.selftest.dto.response.MemberSelftestResultResponseDto;
import com.mamdaero.domain.selftest.dto.response.SelftestQuestionResponseDto;
import com.mamdaero.domain.selftest.dto.response.SelftestResponseDto;
import com.mamdaero.domain.selftest.entity.*;
import com.mamdaero.domain.selftest.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SelftestService {

    private final SelftestRepository selftestRepository;
    private final SelftestQuestionRepository selftestQuestionRepository;
    private final SelftestQuestionOptionRepository selftestQuestionOptionRepository;
    private final SelftestQuestionResponseRepository selftestQuestionResponseRepository;
    private final MemberRepository memberRepository;
    private final MemberSelftestListRepository memberSelftestListRepository;

    public List<SelftestResponseDto> findAll() {
        return selftestRepository.findAll().stream()
                .map(SelftestResponseDto::toDTO)
                .toList();
    }

    public List<SelftestQuestionResponseDto> getQuestionsWithOptionsByTestId(Integer selftestId) {
        return selftestQuestionRepository.findBySelftestIdWithOptions(selftestId).stream()
                .map(SelftestQuestionResponseDto::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createByTestId(Long memberId, Integer testId, TestRequestDto requestDto) {

        Optional<Member> optionalMember = memberRepository.findById(memberId);

        Optional<Selftest> optionalSelftest = selftestRepository.findById(testId);

        if (optionalMember.isPresent() && optionalSelftest.isPresent()) {
            Member member = optionalMember.get();
            Selftest selftest = optionalSelftest.get();

            MemberSelftestList memberSelftestList = MemberSelftestList.builder()
                    .member(member)
                    .selftest(selftest)
                    .memberSelftestDate(LocalDateTime.now())
                    .isPublic(requestDto.getIsPublic())
                    .build();

            memberSelftestListRepository.save(memberSelftestList);

            List<Integer> checkList = requestDto.getCheckList();

            if (testId == 1) {
                processDepressedTest(memberSelftestList, checkList);
            } else if (testId == 2) {
                processUnrestTest(memberSelftestList, checkList);
            } else if (testId == 3) {
                processStressTest(memberSelftestList, checkList);
            } else if (testId == 4) {
                processPtsdTest(memberSelftestList, checkList);
            } else if (testId == 5) {
                processBipolarTest(memberSelftestList, checkList);
            }

            // 총 점수 계산
            Integer totalScore = selftestQuestionResponseRepository.findTotalScoreByMemberSelftestListId(memberSelftestList.getId());
            memberSelftestList.updateScore(totalScore);
            memberSelftestListRepository.save(memberSelftestList);
        }
    }

    private void processDepressedTest(MemberSelftestList memberSelftestList, List<Integer> checkList) {
        for (int i = 0; i < checkList.size(); i++) {
            int questionNumber = i + 1;
            int responseValue = checkList.get(i);

            // 응답 값을 기반으로 옵션 ID 가져오기
            int optionIndex = responseValue + 1;  // 응답 값이 0부터 시작하므로 1을 더해줌
            int optionId = (questionNumber - 1) * 4 + optionIndex;  // 각 질문 당 4개의 옵션이 있으므로

            saveSelftestQuestionResponse(memberSelftestList, questionNumber, optionId, responseValue);
        }
    }

    private void processUnrestTest(MemberSelftestList memberSelftestList, List<Integer> checkList) {
        for (int i = 0; i < checkList.size(); i++) {
            int questionNumber = i + 21;
            int responseValue = checkList.get(i);

            // 응답 값을 기반으로 옵션 ID 가져오기
            int optionIndex = responseValue + 1;  // 응답 값이 0부터 시작하므로 1을 더해줌
            int optionId = (questionNumber - 1) * 4 + optionIndex;  // 각 질문 당 4개의 옵션이 있으므로

            if (questionNumber == 21 || questionNumber == 22 || questionNumber == 25 || questionNumber == 28 || questionNumber == 30 ||
                    questionNumber == 31 || questionNumber == 35 || questionNumber == 36 || questionNumber == 38 || questionNumber == 39 || questionNumber == 40) {
                responseValue = 4 - checkList.get(i);
            } else {
                responseValue = checkList.get(i) + 1;
            }

            saveSelftestQuestionResponse(memberSelftestList, questionNumber, optionId, responseValue);
        }
    }

    private void processStressTest(MemberSelftestList memberSelftestList, List<Integer> checkList) {
        for (int i = 0; i < checkList.size(); i++) {
            int questionNumber = i + 41;  // 질문 번호는 41부터 시작
            int responseValue = checkList.get(i);

            if (questionNumber == 44 || questionNumber == 45 || questionNumber == 46 || questionNumber == 47 || questionNumber == 48) {
                responseValue = 4 - checkList.get(i);
            }

            // 응답 값을 기반으로 옵션 ID 가져오기
            int optionIndex = responseValue + 1;  // 응답 값이 0부터 시작하므로 1을 더해줌
            int optionId = 161 + (questionNumber - 41) * 5 + (optionIndex - 1);  // 옵션 ID 계산 (160부터 시작)

            saveSelftestQuestionResponse(memberSelftestList, questionNumber, optionId, responseValue);
        }
    }

    private void processPtsdTest(MemberSelftestList memberSelftestList, List<Integer> checkList) {
        for (int i = 0; i < checkList.size(); i++) {
            int questionNumber = i + 51;
            int responseValue = checkList.get(i);

            // 응답 값을 기반으로 옵션 ID 가져오기
            int optionIndex = responseValue + 1;  // 응답 값이 0부터 시작하므로 1을 더해줌
            int optionId = 211 + (questionNumber - 51) * 5 + (optionIndex - 1);  // 옵션 ID 계산 (160부터 시작)

            saveSelftestQuestionResponse(memberSelftestList, questionNumber, optionId, responseValue);
        }
    }

    private void processBipolarTest(MemberSelftestList memberSelftestList, List<Integer> checkList) {
        for (int i = 0; i < checkList.size(); i++) {
            int questionNumber = i + 73;
            int responseValue = checkList.get(i);

            // 응답 값을 기반으로 옵션 ID 가져오기
            int optionIndex = responseValue + 1;  // 응답 값이 0부터 시작하므로 1을 더해줌
            int optionId = 321 + (questionNumber - 73) * 2 + (optionIndex - 1);  // 각 질문 당 2개의 옵션이 있으므로

            if (responseValue == 1) {
                responseValue = 0;
            } else if (responseValue == 0) {
                responseValue = 1;
            }
            if (questionNumber == 86 || questionNumber == 87) {
                responseValue = 0;
            }

            saveSelftestQuestionResponse(memberSelftestList, questionNumber, optionId, responseValue);
        }
    }

    private void saveSelftestQuestionResponse(MemberSelftestList memberSelftestList, int questionNumber, int optionId, int responseValue) {
        SelftestQuestion selftestQuestion = selftestQuestionRepository.findById(questionNumber).orElseThrow(() -> new RuntimeException("Question not found"));
        SelftestQuestionOption selftestQuestionOption = selftestQuestionOptionRepository.findById(optionId).orElseThrow(() -> new RuntimeException("Option not found"));

        SelftestQuestionResponse selftestQuestionResponse = SelftestQuestionResponse.builder()
                .selftestQuestion(selftestQuestion)
                .selftestQuestionOption(selftestQuestionOption)
                .selftestMemberQuestionScore(responseValue)
                .memberSelftestList(memberSelftestList)
                .build();

        selftestQuestionResponseRepository.save(selftestQuestionResponse);
    }

    @Transactional
    public List<MemberSelftestResponseDto> getMemberSelftestList(Long memberId) {

        return memberSelftestListRepository.findLatestByMemberIdAndSelftestId(memberId).stream()
                .map(MemberSelftestResponseDto::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Page<MemberSelftestResultResponseDto> getMemberSelftestListAll(Long memberId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        List<MemberSelftestResultResponseDto> memberSelftestLists = memberSelftestListRepository.findByMemberIdAndIsPublic(memberId, true).stream()
                .map(MemberSelftestResultResponseDto::toDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(memberSelftestLists, pageable, memberSelftestLists.size());
    }

    @Transactional
    public MemberSelftestResponseDto getMemberSelftestDetail(Long memberId, Integer resultId) {

        if (memberSelftestListRepository.findById(resultId).isPresent()) {
            return MemberSelftestResponseDto.toDTO(memberSelftestListRepository.findByMemberIdAndIdAndIsPublic(memberId, resultId, true));

        }
        throw new RuntimeException("Member selftest not found");
    }
}
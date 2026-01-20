import { Separator } from "../ui";
import { Card } from "../ui";
import { CaseSensitive } from "lucide-react";
import type { Topic } from "@/types/topic.type";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko"; //한국어로 출력하려면

dayjs.extend(relativeTime);
dayjs.locale("ko"); //한국어로 설정

interface Props {
    props: Topic;
}

function extractTextFromContent(content: string | any[], maxChars = 200) {
    if (!content) return "";
    try {
        const parsed = typeof content === "string" ? JSON.parse(content) : content;

        if (!Array.isArray(parsed)) {
            console.warn("content 데이터 타입이 배열이 아닙니다.");
            return "";
        }

        let result = "";

        for (const block of parsed) {
            if (Array.isArray(block.content)) {
                for (const child of block.content) {
                    if (child?.text) {
                        result += child.text + " ";

                        if (result.length >= maxChars) {
                            return result.slice(0, maxChars) + "...";
                        }
                    }
                }
            }
        }

        return result.trim();
    } catch (error) {
        console.log("콘텐츠 파싱 실패", error);
        return "";
    }
}

export function NewTopicCard({ props }: Props) {
    return (
        <Card className="w-full h-fit p-4 gap-4">
            <div className="flex items-start gap-4">
                <div className="flex-1 flex flex-col items-start gap-4">
                    {/* 썸네일과 제목 */}
                    <div className="h-16 flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <CaseSensitive size={16} />
                            <span className="text-xs font-medium uppercase tracking-wider">{props.category || "General"}</span>
                        </div>
                        <h3 className="text-base font-semibold tracking-tight line-clamp-2">
                            {props.title || "제목 없는 토픽"}
                        </h3>
                    </div>
                    {/* 본문 */}
                    <p className="line-clamp-3 text-sm text-muted-foreground ">
                        {extractTextFromContent(props.content)}
                    </p>
                </div>
                {props.thumbnail ? (
                    <img src={props.thumbnail} alt="@THUMBNAIL" className="w-[140px] h-[140px] aspect-square rounded-lg object-cover border" />
                ) : (
                    <div className="w-[140px] h-[140px] aspect-square rounded-lg bg-muted flex items-center justify-center border">
                        <CaseSensitive size={32} className="text-muted-foreground/20" />
                    </div>
                )}
            </div>
            <Separator className="my-2" />
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <p>개발자 도씨</p>
                <p>{dayjs(props.created_at).format("YYYY.MM.DD")}</p>
                {/* {dayjs(props.created_at).format("YYYY.MM.DD")} - ({dayjs(props.created_at).fromNow()}) */}
            </div>
        </Card>
    )
}
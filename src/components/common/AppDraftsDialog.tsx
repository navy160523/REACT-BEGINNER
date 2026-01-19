import { Badge, Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui"
import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { Separator } from "@radix-ui/react-separator";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TOPIC_STATUS, type Topic } from "@/types/topic.type";
import { useNavigate } from "react-router";

interface Props {
    children: React.ReactNode;
}

export function AppDraftsDialog({ children }: Props) {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState<any[]>([]);
    const fetchDrafts = async () => {
        try {
            // .is() 쿼리문은 null만 체크할 경우 사용한다.
            // .eq() 쿼리문을 연속으로 사용하여 임시 저장된 토픽을 조회한다.
            const { data: topic, error } = await supabase.from('topic').select("*").eq("author", user.id).eq("status", TOPIC_STATUS.TEMP);
            console.log("토픽 : ", topic)
            if (error) {
                toast.error(error.message);
                return;
            }
            if (topic) console.log(topic);
            if (topic) setDrafts(topic);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user.id) fetchDrafts();
    }, [user.id]);
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">임시 저장된 토픽</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        임시 저장된 토픽 목록입니다. 이어서 작성하거나 삭제할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 sm:gap-3 py-3 sm:py-4">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <p>임시 저장</p>
                        <p className="text-sm sm:text-base text-green-600 -mr-[6px]">{drafts.length}</p>
                        <p>건</p>
                    </div>
                    <Separator />
                    {drafts.length > 0 ? (
                        <div className="min-h-40 h-60 flex flex-col items-center justify-start gap-3 overflow-y-scroll">
                            {drafts.map((draft: Topic, index: number) => {
                                return (
                                    <div key={draft.id} className="w-full flex items-center justify-between py-2 px-4 gap-3 rounded-md hover:bg-card/50 cursor-pointer" onClick={() => navigate(`/topic/${draft.id}/create`)}>
                                        <div className="flex items-start gap-2">
                                            <Badge className="w-5 h-5 mt-[3px] rounded-sm aspect-square text-foreground bg-[#E26F24] hover:bg-[#E26F24]">{index + 1}</Badge>
                                            <div className="flex flex-col">
                                                <p className="line-clamp-1">{draft.title}</p>
                                                <p className="text-xs text-muted-foreground">작성일 : {dayjs(draft.created_at).format("YYYY.MM.DD")}</p>
                                            </div>
                                        </div>
                                        <Badge variant={"outline"}>작성중</Badge>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="min-h-40 sm:min-h-60 flex items-center justify-center">
                            <p className="text-xs sm:text-sm text-muted-foreground">조회 가능한 정보가 없습니다.</p>
                        </div>
                    )}
                </div>
                <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button type="button" variant={"outline"} className="border-0 text-xs sm:text-sm w-full sm:w-auto">닫기</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
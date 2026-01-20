import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores";
import { AppSidebar } from "../components/common/AppSidebar";
import { SkeletonHotTopic, SkeletonNewTopic } from "../components/skeleton";
import { Button } from "../components/ui";
import { CircleSmall, NotebookPen, PencilLine } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { AppDraftsDialog } from "@/components/common";
import { useEffect, useState } from "react";
import type { Topic } from "@/types/topic.type";
import { NewTopicCard } from "@/components/topics";

function App() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);

  //발행된 토픽 조회
  const fetchTopic = async () => {
    try {
      let { data: topics, error } = await supabase.from('topic').select("*").eq("status", "publish");
      if (error) {
        toast.error(error.message);
        return;
      }
      if (topics) {
        console.log("topics : ", topics)
        setTopics(topics);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  //나만의 토픽 생성 버튼 클릭
  const handleroute = async () => {
    if (!user.id || !user.email || !user.role) {
      toast.warning("토픽 작성은 로그인 후 가능합니다.");
      return;
    }

    // RLS Policy 설정할 때, auth.uid() = author
    const { data, error } = await supabase
      .from('topic')
      .insert([{
        status: null,
        title: null,
        content: null,
        category: null,
        thumbnail: null,
        author: user.id,
      }])
      .select()

    if (error) {
      toast.error(error.message);
      return;
    }

    console.log("data : ", data);

    if (data) {
      toast.success("토픽을 생성하였습니다.");
      navigate(`/topic/${data[0].id}/create`)
      return;
    }

    navigate('/topic/create')
  };

  useEffect(() => {
    fetchTopic();
  }, []);

  return (
    <main className="w-full h-full min-h-[720px] flex flex-col lg:flex-row p-3 sm:p-4 lg:p-6 gap-3 sm:gap-4 lg:gap-6">
      <div className="fixed right-1/2 bottom-5 sm:bottom-8 lg:bottom-10 translate-x-1/2 z-20 items-center flex gap-2 flex-wrap justify-center" >
        <Button variant={"destructive"} className="!py-4 !px-4 sm:!py-5 sm:!px-5 lg:!py-5 lg:!px-6 rounded-full text-xs sm:text-sm" onClick={handleroute}>
          <PencilLine size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">나만의 토픽 작성</span>
          <span className="sm:hidden">작성</span>
        </Button>
        <AppDraftsDialog>
          <div className="relative">
            <Button variant={"outline"} className="w-10 h-10 rounded-full">
              <NotebookPen />
            </Button>
            <CircleSmall size={14} className="absolute top-0 right-0 text-red-500" fill="#EF4444" />
          </div>
        </AppDraftsDialog>
      </div>
      {/* 카테고리 사이드바 */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      {/* 토픽 콘텐츠 */}
      <section className="flex-1 w-full flex flex-col gap-6 sm:gap-8 lg:gap-12">
        {/* 핫 토픽 */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <img src="/assets/gifs/gif-002.gif" alt="🔥" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              <h4 className="scroll-m-20 text-base sm:text-lg lg:text-xl font-semibold tracking-tight">Hot 토픽</h4>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground"> 지금 가장 주목받는 주제들을 살펴보고, 다양한 관점의 인사이트를 얻어보세요. </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <SkeletonHotTopic />
            <SkeletonHotTopic />
            <SkeletonHotTopic />
            <SkeletonHotTopic />
          </div>
        </div>
        {/* NEW 토픽 */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <img src="/assets/gifs/gif-001.gif" alt="🔥" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              <h4 className="scroll-m-20 text-base sm:text-lg lg:text-xl font-semibold tracking-tight">New 토픽</h4>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground"> 새로운 시선으로, 새로운 이야기를 시작하세요. 지금 바로 당신만의 토픽을 작성해보세요.</p>
          </div>
          {topics.length > 0 ? (
            <div className="min-h-120 grid grid-cols-2 gap-6">
              {topics.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((topic: Topic) => {
                  return <NewTopicCard key={topic.id} props={topic} />
                })}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <p className="text-muted-foreground">조회 가능한 토픽이 없습니다.</p>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
export default App

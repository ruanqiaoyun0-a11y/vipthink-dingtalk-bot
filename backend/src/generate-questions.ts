import db from './db';

interface Question {
  day: number;
  type: 'practice' | 'exam';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

// DAY1 - 产品介绍题目（40题）
const day1Questions: Question[] = [
  // 产品核心功能
  {
    day: 1,
    type: 'practice',
    question: 'VIPthink豌豆益智的核心定位是什么？',
    options: ['数学思维训练平台', '语文阅读平台', '英语学习平台', '编程教育平台'],
    answer: 0,
    explanation: 'VIPthink豌豆益智专注于数学思维训练，通过益智游戏和互动课程培养孩子的数学思维能力。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智课程适合哪个年龄段的孩子？',
    options: ['3-6岁', '6-12岁', '12-18岁', '所有年龄段'],
    answer: 1,
    explanation: '豌豆益智课程主要针对6-12岁的小学生，帮助他们建立数学思维基础。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程形式主要包括哪些？',
    options: ['线下大班课', '在线一对一', '在线小班互动课', '录播视频课'],
    answer: 2,
    explanation: '豌豆益智采用在线小班互动课形式，每班4-6人，保证互动性和针对性。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程时长一般是多少？',
    options: ['30分钟', '45分钟', '60分钟', '90分钟'],
    answer: 2,
    explanation: '每节课时长为60分钟，包含互动教学、练习巩固和课后反馈环节。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的教学理念是什么？',
    options: ['应试提分为主', '培养数学思维能力', '超前学习进度', '竞赛培训导向'],
    answer: 1,
    explanation: '豌豆益智注重培养孩子的数学思维能力，而非单纯的应试技巧，帮助孩子建立终身受益的思维方式。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程体系分为几个级别？',
    options: ['3个级别', '6个级别', '9个级别', '12个级别'],
    answer: 2,
    explanation: '课程体系分为9个级别，从L1到L9，覆盖小学全学段，难度循序渐进。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智每节课的班级人数是多少？',
    options: ['1对1', '2-3人', '4-6人', '10人以上'],
    answer: 2,
    explanation: '采用4-6人小班教学，既保证互动性，又培养孩子的竞争与合作意识。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的师资要求是什么？',
    options: ['任意大学生兼职', '需要教师资格证', '专业培训认证', '无特殊要求'],
    answer: 2,
    explanation: '所有老师都经过专业培训认证，具备数学教学能力和儿童心理学知识。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程内容包括哪些模块？',
    options: ['只有计算训练', '数与代数、几何、统计等', '只有几何图形', '只有应用题'],
    answer: 1,
    explanation: '课程内容涵盖数与代数、几何与图形、统计与概率、综合应用等多个模块。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智相比传统数学培训的优势是什么？',
    options: ['价格更便宜', '互动性强、思维培养', '离家更近', '作业更少'],
    answer: 1,
    explanation: '豌豆益智通过互动式教学和思维训练方法，培养孩子的主动思考能力，而非机械刷题。'
  },
  // 产品优势
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的"益智"体现在哪里？',
    options: ['游戏化学习设计', '课后作业少', '上课时间短', '价格便宜'],
    answer: 0,
    explanation: '通过游戏化的教学设计，让孩子在玩乐中学习数学，培养学习兴趣。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智如何保证学习效果？',
    options: ['只靠上课', '课前测评+课中互动+课后巩固', '家长监督', '大量作业'],
    answer: 1,
    explanation: '完整的闭环学习体系：课前测评了解基础，课中互动教学，课后巩固练习。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课后服务包括哪些？',
    options: ['无课后服务', '学习报告+答疑', '只有作业', '家长会'],
    answer: 1,
    explanation: '提供详细的学习报告、老师在线答疑、学习规划建议等课后服务。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程更新频率是？',
    options: ['从不更新', '每学期更新', '持续迭代优化', '每年更新一次'],
    answer: 2,
    explanation: '课程内容持续迭代优化，根据教学反馈和最新教育理念不断改进。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智支持哪些设备上课？',
    options: ['只能电脑', '只能iPad', '电脑、平板、手机', '只能手机'],
    answer: 2,
    explanation: '支持电脑、iPad、手机等多种设备，方便孩子随时随地学习。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的试听课政策是？',
    options: ['无试听', '付费试听', '免费试听', '先付费后退'],
    answer: 2,
    explanation: '提供免费试听课，让家长和孩子充分了解课程后再做决定。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的退费政策如何？',
    options: ['不支持退费', '开课前可退', '随时可按比例退费', '只能转课'],
    answer: 2,
    explanation: '支持随时退费，按未上课比例退还学费，保障家长权益。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智如何帮助孩子建立学习习惯？',
    options: ['强制打卡', '趣味激励机制', '家长监督', '无特别设计'],
    answer: 1,
    explanation: '通过积分、勋章、排行榜等趣味激励机制，激发孩子的学习主动性。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程研发团队背景是？',
    options: ['普通教师', '名校数学专家', '程序员', '无专业背景'],
    answer: 1,
    explanation: '由名校数学专家、教育心理学专家和一线名师共同研发课程。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智与校内数学的关系是？',
    options: ['完全脱节', '超前学习', '衔接校内、拓展思维', '只讲校内内容'],
    answer: 2,
    explanation: '课程与校内数学知识点衔接，同时拓展思维训练，帮助孩子在校内学习更轻松。'
  },
  // 目标用户
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智最适合哪类家庭？',
    options: ['不关心教育的家庭', '重视思维培养的中产家庭', '只看重分数的家庭', '所有家庭'],
    answer: 1,
    explanation: '最适合重视孩子综合素质培养、关注思维能力发展的中产家庭。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的目标家长痛点是什么？',
    options: ['孩子不喜欢数学', '校内成绩差', '想培养思维能力', '以上都是'],
    answer: 3,
    explanation: '解决孩子不喜欢数学、校内成绩不理想、思维能力不足等多重痛点。'
  },
  {
    day: 1,
    type: 'practice',
    question: '哪些孩子特别适合豌豆益智？',
    options: ['数学天才', '对数学有畏难情绪的孩子', '不需要数学的孩子', '所有孩子'],
    answer: 1,
    explanation: '特别适合对数学有畏难情绪、缺乏学习兴趣、需要思维启蒙的孩子。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的家长画像特征是？',
    options: ['低学历家长', '高知、重视教育的家长', '无时间管孩子的家长', '所有家长'],
    answer: 1,
    explanation: '目标家长通常是高知群体，重视教育质量，愿意为优质教育投入。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智解决的核心家长需求是？',
    options: ['便宜的课程', '省心的托管', '孩子的思维成长', '大量的作业'],
    answer: 2,
    explanation: '核心满足家长对孩子数学思维成长的需求，而非简单的分数提升。'
  },
  // 竞品对比
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智与传统线下数学班相比的优势是？',
    options: ['价格更低', '省去接送时间、互动性更强', '老师更好', '作业更多'],
    answer: 1,
    explanation: '在线上课省去接送时间，小班互动比大班课互动性更强。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智与录播课相比的优势是？',
    options: ['价格更低', '实时互动、老师关注', '可以回放', '内容更多'],
    answer: 1,
    explanation: '直播小班课有实时互动，老师能关注每个孩子的学习状态。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智与一对一课程相比的优势是？',
    options: ['价格更高', '价格更优、同伴学习氛围', '效果更好', '时间更长'],
    answer: 1,
    explanation: '小班课价格比一对一更优，同时同伴学习能激发竞争意识。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智与其他在线数学品牌相比的特色是？',
    options: ['价格最低', '益智游戏化教学', '老师最多', '课程最短'],
    answer: 1,
    explanation: '益智游戏化教学是豌豆益智的核心特色，让孩子在玩中学。'
  },
  // 适用场景
  {
    day: 1,
    type: 'practice',
    question: '什么情况下家长应该考虑豌豆益智？',
    options: ['孩子数学很好不需要', '孩子对数学没兴趣', '只想应试提分', '不想花钱'],
    answer: 1,
    explanation: '当孩子对数学没兴趣、有畏难情绪时，豌豆益智的游戏化教学特别有效。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智适合什么样的学习目标？',
    options: ['短期突击提分', '长期思维培养', '竞赛培训', '应试技巧'],
    answer: 1,
    explanation: '豌豆益智适合长期思维培养的目标，帮助孩子建立受益终身的数学思维。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程安排建议是？',
    options: ['每天上课', '每周1-2次', '每月一次', '随意安排'],
    answer: 1,
    explanation: '建议每周1-2次课程，保证学习频率的同时给孩子消化时间。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智如何配合校内学习？',
    options: ['完全独立', '超前学习', '同步巩固、拓展提升', '只讲校内内容'],
    answer: 2,
    explanation: '课程与校内进度同步巩固，同时拓展思维训练，提升综合能力。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的家长需要做什么配合？',
    options: ['完全不用管', '提供学习环境、关注学习报告', '全程陪同上课', '辅导作业'],
    answer: 1,
    explanation: '家长需要提供安静的学习环境，关注学习报告，给予孩子鼓励。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的课程周期建议是？',
    options: ['只报一期', '长期系统学习', '随时可以停', '最少一年'],
    answer: 1,
    explanation: '建议长期系统学习，数学思维培养需要持续积累。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智如何评估孩子的学习效果？',
    options: ['只看分数', '综合能力测评', '家长主观判断', '不需要评估'],
    answer: 1,
    explanation: '通过综合能力测评，包括计算能力、逻辑推理、空间想象等多维度评估。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的续报率如何？',
    options: ['很低', '行业平均水平', '较高', '不确定'],
    answer: 2,
    explanation: '豌豆益智的续报率较高，说明家长和孩子对课程效果认可度高。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的口碑传播主要靠什么？',
    options: ['大量广告', '家长口碑推荐', '明星代言', '低价促销'],
    answer: 1,
    explanation: '主要依靠家长口碑推荐，说明课程质量得到认可。'
  },
  {
    day: 1,
    type: 'practice',
    question: '豌豆益智的市场定位是？',
    options: ['低端市场', '中高端市场', '高端市场', '所有市场'],
    answer: 1,
    explanation: '定位中高端市场，为重视教育的家庭提供优质的数学思维教育服务。'
  }
];

// DAY2 - 电销话术题目（40题）
const day2Questions: Question[] = [
  // 开场白技巧
  {
    day: 2,
    type: 'practice',
    question: '电销开场白最重要的是什么？',
    options: ['快速介绍产品', '建立信任和好感', '直接报价', '询问需求'],
    answer: 1,
    explanation: '开场白首要目标是建立信任和好感，让家长愿意继续听下去。'
  },
  {
    day: 2,
    type: 'practice',
    question: '以下哪个是好的开场白话术？',
    options: ['您好，我是豌豆益智的', '您好，请问您孩子几年级？', '您好，打扰您几分钟时间', '您好，我们有优惠活动'],
    answer: 2,
    explanation: '礼貌地说明打扰时间，比直接推销更容易被接受。'
  },
  {
    day: 2,
    type: 'practice',
    question: '开场白中如何快速引起家长兴趣？',
    options: ['直接说价格', '提及家长关心的痛点', '介绍公司背景', '说课程时长'],
    answer: 1,
    explanation: '提及家长关心的痛点（如孩子数学学习问题），能快速引起兴趣。'
  },
  {
    day: 2,
    type: 'practice',
    question: '电话接通后，前几秒最重要的是？',
    options: ['语速要快', '声音热情、语调自然', '声音严肃', '保持沉默'],
    answer: 1,
    explanation: '前几秒用热情自然的声音打招呼，给家长留下好印象。'
  },
  {
    day: 2,
    type: 'practice',
    question: '开场白时如何处理家长的"没时间"？',
    options: ['继续说下去', '快速约定回访时间', '直接挂断', '抱怨家长'],
    answer: 1,
    explanation: '礼貌地约定下次回访时间，体现专业和尊重。'
  },
  {
    day: 2,
    type: 'practice',
    question: '开场白中如何自我介绍更有效？',
    options: ['只说公司名', '说公司名+能带来的价值', '只说自己的名字', '不说介绍'],
    answer: 1,
    explanation: '介绍公司名的同时说明能带来的价值，让家长知道为什么要听。'
  },
  {
    day: 2,
    type: 'practice',
    question: '开场白应该控制在多长时间？',
    options: ['1分钟以内', '2-3分钟', '5分钟', '越短越好'],
    answer: 0,
    explanation: '开场白控制在1分钟以内，快速切入正题。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何判断开场白是否成功？',
    options: ['家长没挂电话', '家长开始提问', '家长同意试听', '以上都是'],
    answer: 3,
    explanation: '家长没挂电话、开始提问、同意试听都是开场白成功的信号。'
  },
  // 需求挖掘话术
  {
    day: 2,
    type: 'practice',
    question: '需求挖掘的核心目的是什么？',
    options: ['收集信息', '找到痛点、建立共鸣', '判断购买力', '打发时间'],
    answer: 1,
    explanation: '需求挖掘是为了找到家长的痛点，建立共鸣，为后续推荐做铺垫。'
  },
  {
    day: 2,
    type: 'practice',
    question: '以下哪个是好的需求挖掘问题？',
    options: ['您想买课吗？', '孩子平时数学学习情况怎么样？', '您有多少预算？', '您住哪里？'],
    answer: 1,
    explanation: '询问孩子数学学习情况，能自然地引出家长的痛点和需求。'
  },
  {
    day: 2,
    type: 'practice',
    question: '需求挖掘时应该多问什么类型的问题？',
    options: ['封闭式问题', '开放式问题', '诱导式问题', '质问式问题'],
    answer: 1,
    explanation: '开放式问题能让家长多说，从中获取更多信息。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何挖掘家长对孩子数学的期望？',
    options: ['直接问期望', '问现状+问理想状态', '假设期望', '不需要问'],
    answer: 1,
    explanation: '先问现状，再问理想状态，对比中能发现家长的期望。'
  },
  {
    day: 2,
    type: 'practice',
    question: '需求挖掘时家长说"孩子数学还行"，应该？',
    options: ['直接推荐课程', '追问"还行"的具体表现', '认为不需要课程', '结束通话'],
    answer: 1,
    explanation: '追问"还行"的具体表现，可能发现潜在问题或提升空间。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何了解家长的教育理念？',
    options: ['直接问理念', '通过聊天侧面了解', '不重要', '假设所有家长一样'],
    answer: 1,
    explanation: '通过聊天侧面了解家长的教育理念，便于针对性推荐。'
  },
  {
    day: 2,
    type: 'practice',
    question: '需求挖掘时如何处理家长的反问？',
    options: ['忽略反问', '先回答再继续提问', '被反问牵着走', '直接挂断'],
    answer: 1,
    explanation: '先回答家长的反问，建立互动，再继续提问。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何判断家长的决策权？',
    options: ['直接问', '通过对话判断', '不重要', '假设都是妈妈决定'],
    answer: 1,
    explanation: '通过对话判断谁是决策者，便于重点沟通。'
  },
  // 产品介绍话术
  {
    day: 2,
    type: 'practice',
    question: '产品介绍时应该先说什么？',
    options: ['价格', '能解决家长痛点的价值', '公司背景', '课程时长'],
    answer: 1,
    explanation: '先说能解决家长痛点的价值，让家长产生兴趣。'
  },
  {
    day: 2,
    type: 'practice',
    question: '产品介绍时如何避免家长走神？',
    options: ['语速要快', '互动提问、确认理解', '一直说不停', '声音要大'],
    answer: 1,
    explanation: '通过互动提问、确认理解，保持家长的参与度。'
  },
  {
    day: 2,
    type: 'practice',
    question: '介绍课程特色时，应该？',
    options: ['全部特色都说一遍', '针对家长需求说相关特色', '只说一个特色', '不说特色'],
    answer: 1,
    explanation: '针对家长的需求痛点，说相关的课程特色，更有说服力。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何介绍小班教学的优势？',
    options: ['只说人数少', '说人数少+互动性强+关注度高', '不介绍', '说比一对一便宜'],
    answer: 1,
    explanation: '综合介绍小班的优势：人数少、互动性强、老师关注度高。'
  },
  {
    day: 2,
    type: 'practice',
    question: '介绍价格时应该？',
    options: ['直接说总价', '先说价值再说价格', '不主动说价格', '说比别人便宜'],
    answer: 1,
    explanation: '先让家长了解课程价值，再说价格，更容易接受。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何用案例增强说服力？',
    options: ['编造案例', '说真实的成功案例', '不说案例', '只说数据'],
    answer: 1,
    explanation: '用真实的成功案例，让家长看到课程效果。'
  },
  {
    day: 2,
    type: 'practice',
    question: '产品介绍时如何处理家长的比较？',
    options: ['贬低竞品', '客观分析差异优势', '说都一样', '拒绝比较'],
    answer: 1,
    explanation: '客观分析与其他产品的差异和自身优势，体现专业。'
  },
  {
    day: 2,
    type: 'practice',
    question: '介绍试听课时应该强调什么？',
    options: ['免费', '免费+无压力+体验效果', '时间短', '老师好'],
    answer: 1,
    explanation: '强调免费、无压力、能真实体验课程效果。'
  },
  // 成交促成话术
  {
    day: 2,
    type: 'practice',
    question: '促成成交的最佳时机是？',
    options: ['说完产品介绍后', '家长发出购买信号时', '固定的时间点', '任何时候'],
    answer: 1,
    explanation: '当家长发出购买信号（如问价格、问上课时间）时，是最佳成交时机。'
  },
  {
    day: 2,
    type: 'practice',
    question: '以下哪个是购买信号？',
    options: ['家长说太贵了', '家长问上课时间', '家长说考虑一下', '以上都是'],
    answer: 3,
    explanation: '问价格、问时间、说考虑都是购买信号，需要区别应对。'
  },
  {
    day: 2,
    type: 'practice',
    question: '家长说"考虑一下"时，应该？',
    options: ['直接挂断', '约定回访时间+了解顾虑', '继续推销', '放弃这个家长'],
    answer: 1,
    explanation: '约定回访时间，同时了解家长的顾虑，便于下次针对性沟通。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何处理价格异议？',
    options: ['直接降价', '强调价值+提供分期方案', '说不能便宜', '贬低便宜的课程'],
    answer: 1,
    explanation: '强调课程价值，提供分期付款等方案，而非直接降价。'
  },
  {
    day: 2,
    type: 'practice',
    question: '促成成交时应该用什么语气？',
    options: ['命令式', '建议式、引导式', '乞求式', '无所谓式'],
    answer: 1,
    explanation: '用建议式、引导式的语气，让家长感觉是自己做的决定。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何制造紧迫感但不让家长反感？',
    options: ['说今天最后一天', '说优惠名额有限', '不说紧迫感', '威胁家长'],
    answer: 1,
    explanation: '说优惠名额有限，比"最后一天"更真实不反感。'
  },
  {
    day: 2,
    type: 'practice',
    question: '成交后应该做什么？',
    options: ['直接挂断', '确认信息+说明后续流程', '继续推销', '什么都不做'],
    answer: 1,
    explanation: '确认报名信息，说明后续上课流程，让家长放心。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何提高成交率？',
    options: ['多打电话', '精准需求匹配+专业话术', '降低价格', '夸大效果'],
    answer: 1,
    explanation: '精准的需求匹配和专业的销售话术是提高成交率的关键。'
  },
  // 异议处理
  {
    day: 2,
    type: 'practice',
    question: '家长说"孩子还小，不着急"时，应该？',
    options: ['同意家长观点', '说明思维培养越早越好', '放弃这个家长', '强行推销'],
    answer: 1,
    explanation: '说明数学思维培养越早越好，错过关键期会影响后续学习。'
  },
  {
    day: 2,
    type: 'practice',
    question: '家长说"已经在其他机构学了"时，应该？',
    options: ['贬低其他机构', '了解情况+说明差异优势', '直接放弃', '说都一样'],
    answer: 1,
    explanation: '了解在其他机构的学习情况，说明豌豆益智的差异优势。'
  },
  {
    day: 2,
    type: 'practice',
    question: '家长说"没效果怎么办"时，应该？',
    options: ['保证一定有效', '说明学习机制+试听体验', '说不知道', '回避问题'],
    answer: 1,
    explanation: '说明完整的学习机制，建议先试听体验课程效果。'
  },
  {
    day: 2,
    type: 'practice',
    question: '家长说"孩子不喜欢上网课"时，应该？',
    options: ['说孩子会习惯的', '了解原因+说明互动特色', '放弃这个家长', '说线下更贵'],
    answer: 1,
    explanation: '了解孩子不喜欢的原因，说明豌豆益智的互动特色能吸引孩子。'
  },
  {
    day: 2,
    type: 'practice',
    question: '处理异议时的态度应该是？',
    options: ['辩解', '理解+共情+解决', '忽视', '反驳'],
    answer: 1,
    explanation: '先理解和共情家长的顾虑，再提供解决方案。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何应对"没时间上课"的异议？',
    options: ['说时间很短', '了解时间安排+提供灵活方案', '放弃这个家长', '说别人都有时间'],
    answer: 1,
    explanation: '了解家长的时间安排，提供灵活的上课时间选择。'
  },
  {
    day: 2,
    type: 'practice',
    question: '家长说"和家里人商量一下"时，应该？',
    options: ['等待家长主动联系', '约定回访时间+提供资料', '放弃这个家长', '要求当场决定'],
    answer: 1,
    explanation: '约定回访时间，同时提供课程资料便于家长和家人商量。'
  },
  {
    day: 2,
    type: 'practice',
    question: '如何提高电话接通率？',
    options: ['多打电话', '选择合适时间段+优化开场白', '早晚打', '随机打'],
    answer: 1,
    explanation: '选择家长方便的时间段，优化开场白提高接通后的留存率。'
  }
];

// DAY3 - 跟进与异议处理题目（45题）
const day3Questions: Question[] = [
  // 课后跟进SOP
  {
    day: 3,
    type: 'practice',
    question: '试听课后的跟进时机是？',
    options: ['一周后', '当天或次日', '等家长主动联系', '一个月后'],
    answer: 1,
    explanation: '试听课后当天或次日及时跟进，趁热打铁提高转化率。'
  },
  {
    day: 3,
    type: 'practice',
    question: '跟进时首先应该做什么？',
    options: ['直接问买不买', '询问试听感受', '说优惠活动', '介绍更多课程'],
    answer: 1,
    explanation: '先询问试听感受，了解家长和孩子的反馈。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长对试听课反馈很好但不报名，应该？',
    options: ['放弃这个家长', '了解不报名的原因', '继续说优惠', '要求报名'],
    answer: 1,
    explanation: '反馈好但不报名，需要了解具体原因，针对性解决。'
  },
  {
    day: 3,
    type: 'practice',
    question: '跟进的频率应该是？',
    options: ['每天一次', '根据家长反馈调整', '一周一次', '随意'],
    answer: 1,
    explanation: '根据家长的反馈和态度调整跟进频率，避免过度打扰。'
  },
  {
    day: 3,
    type: 'practice',
    question: '跟进时如何保持专业形象？',
    options: ['只关心成交', '关心孩子学习+提供价值', '随意聊天', '催促报名'],
    answer: 1,
    explanation: '关心孩子的学习情况，提供有价值的教育建议，体现专业。'
  },
  {
    day: 3,
    type: 'practice',
    question: '多次跟进后家长仍不报名，应该？',
    options: ['放弃', '放入长期培育池', '继续频繁跟进', '删除联系方式'],
    answer: 1,
    explanation: '放入长期培育池，定期发送有价值的内容，等待时机。'
  },
  {
    day: 3,
    type: 'practice',
    question: '跟进时可以提供什么价值？',
    options: ['只说优惠', '教育资讯+学习建议', '什么都不提供', '催促报名'],
    answer: 1,
    explanation: '提供教育资讯、学习建议等有价值的内容，建立信任。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何记录跟进情况？',
    options: ['不记录', '详细记录每次沟通', '只记录成交的', '随意记录'],
    answer: 1,
    explanation: '详细记录每次沟通内容和家长反馈，便于后续针对性跟进。'
  },
  // 签单后SOP
  {
    day: 3,
    type: 'practice',
    question: '签单后第一时间应该做什么？',
    options: ['结束服务', '发送确认信息+上课指引', '等待家长联系', '推销更多课程'],
    answer: 1,
    explanation: '发送报名确认信息和上课指引，让家长清楚后续流程。'
  },
  {
    day: 3,
    type: 'practice',
    question: '首次上课前应该做什么？',
    options: ['什么都不做', '提醒上课时间+测试设备', '等家长自己准备', '再次确认报名'],
    answer: 1,
    explanation: '提醒上课时间，帮助测试设备，确保首次上课顺利。'
  },
  {
    day: 3,
    type: 'practice',
    question: '首次上课后应该做什么？',
    options: ['等待家长反馈', '主动联系了解体验', '什么都不做', '推销续费'],
    answer: 1,
    explanation: '主动联系了解首次上课体验，及时解决问题。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何处理上课过程中的问题？',
    options: ['推给客服', '第一时间响应+协调解决', '等家长投诉', '忽视问题'],
    answer: 1,
    explanation: '第一时间响应家长问题，协调资源解决，体现服务态度。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何促进家长转介绍？',
    options: ['直接要求', '服务做好+适时提醒', '不给转介绍', '强迫家长'],
    answer: 1,
    explanation: '把服务做好，在家长满意时适时提醒转介绍。'
  },
  {
    day: 3,
    type: 'practice',
    question: '续费跟进的时机是？',
    options: ['课程结束前1周', '课程结束前2-4周', '课程结束后', '随意'],
    answer: 1,
    explanation: '在课程结束前2-4周开始续费沟通，给家长考虑时间。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何提高续费率？',
    options: ['只靠优惠', '保证学习效果+良好服务', '强迫续费', '不跟进'],
    answer: 1,
    explanation: '保证学习效果，提供良好服务，续费自然水到渠成。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长提出退费时，应该？',
    options: ['直接办理', '了解原因+尝试挽留', '拒绝退费', '不理会'],
    answer: 1,
    explanation: '先了解退费原因，尝试解决问题挽留，最后按政策办理。'
  },
  // 异议处理进阶
  {
    day: 3,
    type: 'practice',
    question: '家长说"孩子试听了不喜欢"时，应该？',
    options: ['放弃这个家长', '了解不喜欢的具体原因', '说孩子会习惯的', '责怪孩子'],
    answer: 1,
    explanation: '了解孩子不喜欢的具体原因，可能是课程难度、老师风格等。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何处理"效果不明显"的异议？',
    options: ['说需要时间', '展示学习数据+说明长期性', '否认问题', '放弃家长'],
    answer: 1,
    explanation: '展示孩子的学习数据和进步，说明思维培养需要长期积累。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长说"老师不够好"时，应该？',
    options: ['否认问题', '了解具体情况+提供解决方案', '换老师', '责怪家长'],
    answer: 1,
    explanation: '了解具体问题，提供换老师或其他解决方案。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何应对"时间冲突"的异议？',
    options: ['说没办法', '提供多种时间选择', '要求家长调整', '放弃家长'],
    answer: 1,
    explanation: '提供多种上课时间选择，帮助家长找到合适的时间。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长说"孩子作业太多没时间"时，应该？',
    options: ['说这很重要', '说明课程效率+帮助规划时间', '放弃家长', '责怪学校'],
    answer: 1,
    explanation: '说明课程的高效性，帮助家长规划孩子的学习时间。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何处理"和其他活动冲突"的异议？',
    options: ['说数学更重要', '了解情况+协调时间', '放弃家长', '要求放弃其他活动'],
    answer: 1,
    explanation: '了解其他活动情况，协调上课时间或说明数学思维的重要性。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长说"经济压力大"时，应该？',
    options: ['说价格已经很便宜', '提供分期方案+说明价值', '放弃家长', '降低价格'],
    answer: 1,
    explanation: '提供分期付款方案，说明课程价值和对孩子的意义。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何应对"家里老人反对"的异议？',
    options: ['说老人不懂', '提供资料说服老人', '放弃这个家庭', '要求家长自己做主'],
    answer: 1,
    explanation: '提供课程资料和效果说明，帮助家长说服老人。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长说"孩子成绩已经很好了"时，应该？',
    options: ['放弃家长', '说明思维培养的价值', '说不需要了', '同意家长'],
    answer: 1,
    explanation: '说明即使成绩好，思维培养也能让孩子更优秀。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何处理"孩子有学习障碍"的情况？',
    options: ['拒绝服务', '了解情况+提供针对性方案', '说无法帮助', '正常教学'],
    answer: 1,
    explanation: '了解孩子的具体情况，提供针对性的教学方案或建议。'
  },
  // 客户关系维护
  {
    day: 3,
    type: 'practice',
    question: '如何维护已签约家长的关系？',
    options: ['只在续费时联系', '定期沟通+提供价值', '不联系', '等家长主动联系'],
    answer: 1,
    explanation: '定期沟通孩子学习情况，提供有价值的教育建议。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长满意度调查的目的是？',
    options: ['走形式', '发现问题+改进服务', '推销续费', '收集数据'],
    answer: 1,
    explanation: '通过满意度调查发现问题，持续改进服务质量。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何处理家长的投诉？',
    options: ['推卸责任', '认真倾听+及时解决', '忽视投诉', '反驳家长'],
    answer: 1,
    explanation: '认真倾听家长投诉，及时解决问题，挽回信任。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长推荐朋友后应该做什么？',
    options: ['什么都不做', '感谢家长+跟进朋友', '只跟进朋友', '忘记感谢'],
    answer: 1,
    explanation: '感谢推荐家长，及时跟进朋友，让家长感受到重视。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何建立家长的信任？',
    options: ['说好听的话', '专业服务+真诚沟通', '夸大效果', '迎合家长'],
    answer: 1,
    explanation: '通过专业的服务和真诚的沟通建立长期信任。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长生日或节日时应该？',
    options: ['什么都不做', '发送祝福', '推销课程', '等家长联系'],
    answer: 1,
    explanation: '发送节日祝福，体现关怀，维护关系。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何让家长成为忠实客户？',
    options: ['靠优惠', '持续提供价值+良好体验', '强迫续费', '不维护'],
    answer: 1,
    explanation: '持续提供有价值的服务和良好的学习体验。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长提出建议时应该？',
    options: ['忽视建议', '感谢+评估采纳', '反驳家长', '敷衍了事'],
    answer: 1,
    explanation: '感谢家长的建议，评估后采纳可行的建议。'
  },
  // 综合场景
  {
    day: 3,
    type: 'practice',
    question: '试听课孩子很喜欢，家长犹豫价格，应该？',
    options: ['放弃', '强调价值+提供方案', '直接降价', '等家长决定'],
    answer: 1,
    explanation: '强调课程价值和孩子喜欢的重要性，提供分期等方案。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长说"先报一期试试"时，应该？',
    options: ['同意', '说明长期学习效果更好', '拒绝短期报名', '什么都不说'],
    answer: 1,
    explanation: '同意报名，同时说明长期系统学习效果更好，为续费铺垫。'
  },
  {
    day: 3,
    type: 'practice',
    question: '孩子上课表现不好，家长想退费，应该？',
    options: ['直接退费', '了解原因+提供解决方案', '拒绝退费', '责怪孩子'],
    answer: 1,
    explanation: '了解表现不好的原因，提供针对性的解决方案。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长问"和XX机构比怎么样"时，应该？',
    options: ['贬低对方', '客观比较+突出优势', '说都差不多', '拒绝比较'],
    answer: 1,
    explanation: '客观分析差异，突出自身优势，体现专业。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长说"朋友推荐的"时，应该？',
    options: ['正常销售', '感谢朋友+了解朋友情况', '不关心', '提高价格'],
    answer: 1,
    explanation: '感谢朋友推荐，了解朋友的学习情况作为案例。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何处理"需要和配偶商量"的情况？',
    options: ['等待家长决定', '提供资料+约定回访', '放弃这个家长', '要求当场决定'],
    answer: 1,
    explanation: '提供详细课程资料，约定回访时间，可能需要和配偶一起沟通。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长说"孩子马上升学了"时，应该？',
    options: ['说没关系', '说明升学衔接的重要性', '放弃家长', '等升学后再说'],
    answer: 1,
    explanation: '说明升学衔接的重要性，提前做好思维准备。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何应对"双减政策"相关的顾虑？',
    options: ['回避话题', '说明课程合规性', '说政策不影响', '不知道'],
    answer: 1,
    explanation: '说明课程符合双减政策要求，是素质教育类课程。'
  },
  {
    day: 3,
    type: 'practice',
    question: '家长问"能保证提分吗"时，应该？',
    options: ['保证提分', '说明培养目标+展示案例', '说不能保证', '回避问题'],
    answer: 1,
    explanation: '说明思维培养的目标，展示学员进步案例，不做过分承诺。'
  },
  {
    day: 3,
    type: 'practice',
    question: '如何结束一次成功的销售通话？',
    options: ['直接挂断', '确认信息+感谢+说明后续', '继续推销', '匆忙结束'],
    answer: 1,
    explanation: '确认报名信息，感谢家长信任，说明后续服务流程。'
  }
];

// DAY4 - 综合应用题目（40题）
const day4Questions: Question[] = [
  // 综合知识
  {
    day: 4,
    type: 'practice',
    question: 'VIPthink豌豆益智的核心教育理念是什么？',
    options: ['应试教育', '数学思维培养', '超前学习', '竞赛培训'],
    answer: 1,
    explanation: '豌豆益智的核心教育理念是培养孩子的数学思维能力。'
  },
  {
    day: 4,
    type: 'practice',
    question: '电销成功的核心要素是什么？',
    options: ['打更多电话', '需求匹配+专业沟通', '低价促销', '夸大效果'],
    answer: 1,
    explanation: '电销成功的关键是精准的需求匹配和专业的沟通技巧。'
  },
  {
    day: 4,
    type: 'practice',
    question: '客户跟进的最佳策略是？',
    options: ['频繁打扰', '适时+有价值', '不跟进', '等客户主动'],
    answer: 1,
    explanation: '在合适的时机提供有价值的跟进，不过度打扰。'
  },
  {
    day: 4,
    type: 'practice',
    question: '异议处理的正确态度是？',
    options: ['辩解反驳', '理解共情+解决', '忽视异议', '逃避问题'],
    answer: 1,
    explanation: '先理解和共情家长的顾虑，再提供解决方案。'
  },
  {
    day: 4,
    type: 'practice',
    question: '提高转化率的关键是？',
    options: ['降低价格', '精准匹配+专业服务', '夸大宣传', '强迫购买'],
    answer: 1,
    explanation: '精准的需求匹配和专业的服务是提高转化率的关键。'
  },
  // 情景模拟
  {
    day: 4,
    type: 'practice',
    question: '场景：家长说"孩子数学考了90分，不需要补课"。最佳回应是？',
    options: ['好的，那不需要了', '90分很好，但思维培养能让孩子更优秀', '90分不算高', '您孩子几年级？'],
    answer: 1,
    explanation: '肯定成绩的同时，说明思维培养能让孩子更优秀。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：试听课孩子哭闹不肯上课。最佳处理是？',
    options: ['强迫孩子上课', '了解原因+安抚+调整方案', '放弃这个客户', '责怪家长'],
    answer: 1,
    explanation: '了解孩子哭闹的原因，安抚情绪，调整上课方案。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：家长要求先试听一个月再决定。最佳回应是？',
    options: ['拒绝', '说明试听课机制+提供短期方案', '同意一个月', '要求立即报名'],
    answer: 1,
    explanation: '说明免费试听机制，或提供短期课程方案。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：家长说"朋友家孩子学了没效果"。最佳回应是？',
    options: ['否认可能', '了解具体情况+说明个体差异', '说朋友孩子问题', '放弃这个家长'],
    answer: 1,
    explanation: '了解朋友孩子的具体情况，说明学习效果因人而异。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：家长问"你们和学而思比怎么样"。最佳回应是？',
    options: ['贬低学而思', '客观比较差异+突出优势', '说都差不多', '拒绝比较'],
    answer: 1,
    explanation: '客观分析差异，突出豌豆益智的思维培养特色。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：孩子上课走神，家长想退费。最佳处理是？',
    options: ['直接退费', '了解原因+调整教学方案', '拒绝退费', '责怪孩子'],
    answer: 1,
    explanation: '了解走神原因，调整教学方式或老师，提高孩子专注度。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：家长说"老公不同意"。最佳回应是？',
    options: ['放弃这个家庭', '提供资料+建议一起沟通', '要求妈妈做主', '说老公不懂'],
    answer: 1,
    explanation: '提供详细资料，建议和配偶一起沟通，解答顾虑。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：续费时家长说"孩子没进步"。最佳处理是？',
    options: ['否认问题', '展示学习数据+说明长期性', '放弃续费', '责怪孩子'],
    answer: 1,
    explanation: '展示孩子的学习数据和细微进步，说明思维培养需要长期积累。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：家长要求指定老师。最佳回应是？',
    options: ['拒绝要求', '了解需求+尽量协调', '随意安排', '说不能指定'],
    answer: 1,
    explanation: '了解家长对老师的要求，尽量协调安排合适的老师。'
  },
  {
    day: 4,
    type: 'practice',
    question: '场景：家长说"等打折再报"。最佳回应是？',
    options: ['说不会打折', '说明现在报名的优势', '同意等待', '放弃这个家长'],
    answer: 1,
    explanation: '说明现在报名的优势（如锁定优惠、早点开始学习）。'
  },
  // 案例分析
  {
    day: 4,
    type: 'practice',
    question: '案例：小明妈妈说孩子不喜欢数学，但试听后孩子很开心。转化关键是？',
    options: ['强调价格优惠', '利用孩子喜欢+解决妈妈顾虑', '只说服妈妈', '只说服孩子'],
    answer: 1,
    explanation: '利用孩子喜欢这个契机，同时解决妈妈的其他顾虑。'
  },
  {
    day: 4,
    type: 'practice',
    question: '案例：家长对比了三家机构，最后选择豌豆益智。可能的原因是？',
    options: ['价格最低', '服务好+理念匹配', '离家最近', '广告最多'],
    answer: 1,
    explanation: '选择豌豆益智通常是因为认可教育理念和满意服务体验。'
  },
  {
    day: 4,
    type: 'practice',
    question: '案例：学员续费率高的班级，老师通常具备什么特点？',
    options: ['严厉管教', '关心孩子+及时沟通', '作业少', '价格低'],
    answer: 1,
    explanation: '关心孩子学习，与家长保持良好沟通的老师续费率高。'
  },
  {
    day: 4,
    type: 'practice',
    question: '案例：家长投诉后反而续费了。说明什么？',
    options: ['家长好说话', '投诉处理得当+建立信任', '家长没选择', '运气好'],
    answer: 1,
    explanation: '投诉处理得当，反而让家长感受到负责任的态度，建立信任。'
  },
  {
    day: 4,
    type: 'practice',
    question: '案例：某销售转化率特别高。分析可能的原因是？',
    options: ['运气好', '专业度高+需求匹配精准', '价格低', '打电话多'],
    answer: 1,
    explanation: '专业度高、需求匹配精准是高转化率的核心原因。'
  },
  {
    day: 4,
    type: 'practice',
    question: '案例：家长转介绍了很多朋友。说明什么？',
    options: ['家长闲', '对服务非常满意', '有利益驱动', '家长好说话'],
    answer: 1,
    explanation: '愿意转介绍说明对课程和服务非常满意。'
  },
  // 综合应用
  {
    day: 4,
    type: 'practice',
    question: '完整的销售流程应该是？',
    options: ['开场-报价-成交', '开场-需求挖掘-产品介绍-异议处理-成交', '直接报价', '随意发挥'],
    answer: 1,
    explanation: '完整的销售流程包括开场、需求挖掘、产品介绍、异议处理、成交等环节。'
  },
  {
    day: 4,
    type: 'practice',
    question: '客户生命周期管理包括哪些阶段？',
    options: ['只管成交', '获客-转化-服务-续费-转介绍', '只管续费', '只管服务'],
    answer: 1,
    explanation: '客户生命周期包括获客、转化、服务、续费、转介绍全流程。'
  },
  {
    day: 4,
    type: 'practice',
    question: '如何判断一个家长是否是目标客户？',
    options: ['看收入', '看需求匹配度+购买意向', '看住址', '看职业'],
    answer: 1,
    explanation: '判断需求是否匹配、是否有购买意向和决策能力。'
  },
  {
    day: 4,
    type: 'practice',
    question: '销售中最重要的能力是什么？',
    options: ['说话快', '倾听+共情+解决问题', '声音大', '会忽悠'],
    answer: 1,
    explanation: '倾听、共情和解决问题的能力是销售的核心能力。'
  },
  {
    day: 4,
    type: 'practice',
    question: '如何提高客户满意度？',
    options: ['降低价格', '保证效果+良好服务', '少布置作业', '迎合所有要求'],
    answer: 1,
    explanation: '保证学习效果，提供良好的服务体验。'
  },
  {
    day: 4,
    type: 'practice',
    question: '销售话术应该具备什么特点？',
    options: ['固定不变', '灵活应变+真诚自然', '背诵套用', '夸大其词'],
    answer: 1,
    explanation: '话术要灵活应变，真诚自然，而非机械背诵。'
  },
  {
    day: 4,
    type: 'practice',
    question: '如何处理"考虑一下"这类回复？',
    options: ['放弃', '约定回访+了解顾虑', '继续推销', '强迫决定'],
    answer: 1,
    explanation: '约定回访时间，了解家长的顾虑，便于下次针对性沟通。'
  },
  {
    day: 4,
    type: 'practice',
    question: '什么情况下应该放弃一个客户？',
    options: ['家长说不需要', '明确无需求或无能力', '家长态度不好', '从不放弃'],
    answer: 1,
    explanation: '当明确判断无需求或无购买能力时，可以放弃或放入长期培育。'
  },
  {
    day: 4,
    type: 'practice',
    question: '如何提高自己的销售能力？',
    options: ['多打电话', '复盘总结+学习提升', '模仿别人', '靠天赋'],
    answer: 1,
    explanation: '通过复盘总结每次通话，不断学习和提升。'
  },
  {
    day: 4,
    type: 'practice',
    question: '电销中如何保持良好心态？',
    options: ['不在乎结果', '正确看待拒绝+保持积极', '强迫自己', '压抑情绪'],
    answer: 1,
    explanation: '正确看待拒绝是正常的，保持积极心态继续努力。'
  },
  {
    day: 4,
    type: 'practice',
    question: '如何与不同类型的家长沟通？',
    options: ['用同样方式', '因人而异调整策略', '只和好说话的沟通', '选择家长'],
    answer: 1,
    explanation: '根据家长的性格和需求，调整沟通策略。'
  },
  {
    day: 4,
    type: 'practice',
    question: '销售的本质是什么？',
    options: ['把东西卖出去', '帮助客户解决问题', '赚钱', '说服别人'],
    answer: 1,
    explanation: '销售的本质是帮助客户解决问题，满足需求。'
  },
  {
    day: 4,
    type: 'practice',
    question: '如何建立长期客户关系？',
    options: ['只管成交', '持续提供价值+真诚服务', '靠优惠维持', '不维护'],
    answer: 1,
    explanation: '持续提供有价值的服务，真诚对待每一位客户。'
  },
  {
    day: 4,
    type: 'practice',
    question: 'VIPthink课程顾问的核心价值是什么？',
    options: ['完成业绩', '帮助家长孩子成长', '赚取提成', '推销课程'],
    answer: 1,
    explanation: '核心价值是帮助家长和孩子找到适合的教育方案，实现成长。'
  },
  {
    day: 4,
    type: 'practice',
    question: '如何成为优秀的课程顾问？',
    options: ['靠天赋', '专业产品知识+销售技巧+服务意识', '多打电话', '会说好话'],
    answer: 1,
    explanation: '需要专业的产品知识、销售技巧和真诚的服务意识。'
  }
];

// 合并所有题目
const allQuestions: Question[] = [
  ...day1Questions,
  ...day2Questions,
  ...day3Questions,
  ...day4Questions
];

// 插入题目到数据库
export const generateQuestions = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 先清空现有题目
    db.run('DELETE FROM questions', (err: Error | null) => {
      if (err) {
        console.error('清空题目失败:', err);
        reject(err);
        return;
      }
      
      console.log('已清空现有题目');
      
      // 插入新题目
      const stmt = db.prepare(`
        INSERT INTO questions (day, type, question, options, answer, explanation)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      let completed = 0;
      const total = allQuestions.length;
      
      allQuestions.forEach((q) => {
        stmt.run(
          q.day,
          q.type,
          q.question,
          JSON.stringify(q.options),
          q.answer,
          q.explanation,
          (err: Error | null) => {
            if (err) {
              console.error('插入题目失败:', err);
            }
            completed++;
            if (completed === total) {
              stmt.finalize();
              console.log(`成功生成 ${total} 道题目`);
              console.log(`- DAY1: ${day1Questions.length} 题`);
              console.log(`- DAY2: ${day2Questions.length} 题`);
              console.log(`- DAY3: ${day3Questions.length} 题`);
              console.log(`- DAY4: ${day4Questions.length} 题`);
              resolve();
            }
          }
        );
      });
    });
  });
};

// 如果直接运行此脚本
if (require.main === module) {
  generateQuestions()
    .then(() => {
      console.log('题目生成完成');
      process.exit(0);
    })
    .catch((err) => {
      console.error('题目生成失败:', err);
      process.exit(1);
    });
}

// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（研报、观点、传闻）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "policy", label: "政策监管", feedLabel: "政策监管", section: "政策与监管", guide: "证监会、交易所、央行、财政部及国务院各部门的政策法规：发布、征求意见、实施，监管处罚与问询，发行上市、交易与退市制度的变化。解读政策影响的长文不是政策本身，归观点。" },
  { key: "announcements", label: "公告业绩", feedLabel: "公告与业绩", section: "公告与业绩", guide: "上市公司公告：业绩预告与快报、定期财报、并购重组、回购增持减持、分红送转、再融资、股权激励、股东与实控人变化、问询函与立案调查。公告的媒体转述仍归这里；重点是公司披露的事实，不是当天股价波动。" },
  { key: "market", label: "行情资金", feedLabel: "行情与资金", section: "行情与资金", guide: "指数与板块的行情异动，成交与资金：北向资金、融资融券、大宗交易、ETF 申赎；IPO 与新股、停复牌、异动澄清，以及交易制度与市场规则的变化。个股的单纯涨跌没有原因分析的不算。" },
  { key: "industry", label: "产业动态", feedLabel: "产业动态", section: "产业动态", guide: "以非公告形式发生的公司与产业事实：产能与订单、产品价格、技术突破、供应链变化、行业景气度、竞争格局。已披露的公司事实归公告业绩；讨论产业影响的判断归观点。" },
  { key: "views", label: "机构观点", feedLabel: "机构观点", section: "观点与传闻", guide: "券商研报、机构评级与目标价调整、基金经理与知名投资者的观点、市场传闻与辟谣。重点是判断和预期，不是已发生的事实；用观点报道新事件的稿件看正文重心，事实为主仍归事件类。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布：日报报头按它数（后台改了分类，已出的日报会重算）。
 * 股票行业没有类似“新模型”这样每天可数的一类发布，设为 null，报头不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["a股", "港股", "美股", "ipo", "etf", "pe", "pb", "eps", "roe", "cpi", "ppi", "pmi", "gdp", "lpr", "sec", "涨停", "跌停", "北向资金", "港股通", "融资融券", "并购重组", "限售股"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["policy_release", "company_announcement", "market_move", "sector_event", "research_report", "opinion_analysis", "data_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "政策/监管", "公告/业绩", "行情/资金", "产业动态", "评级/研报", "传闻/辟谣", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "宏观", "货币政策", "IPO/新股", "并购重组", "业绩", "回购增持", "分红", "股东变动", "监管处罚", "指数", "资金流向", "半导体", "新能源", "医药生物", "消费", "金融", "地产", "AI",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["贵州茅台", "宁德时代", "比亚迪", "中芯国际", "腾讯控股", "阿里巴巴", "美团", "英伟达", "苹果", "微软", "特斯拉", "亚马逊"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 立法: "政策/监管",
  财报: "业绩", 业绩预告: "业绩", 季报: "业绩", 年报: "业绩", 中报: "业绩", 快报: "业绩",
  回购: "回购增持", 增持: "回购增持", 减持: "股东变动", 解禁: "股东变动", 股权变动: "股东变动",
  分红派息: "分红", 送转: "分红", 派息: "分红",
  北向: "资金流向", 陆股通: "资金流向", 两融: "资金流向", 融资融券: "资金流向", 大宗交易: "资金流向", 主力资金: "资金流向",
  降息: "货币政策", 降准: "货币政策", 加息: "货币政策", 央行操作: "货币政策", 流动性: "货币政策",
  研报: "评级/研报", 券商研报: "评级/研报", 评级: "评级/研报", 目标价: "评级/研报", 机构观点: "评级/研报",
  辟谣: "传闻/辟谣", 传闻: "传闻/辟谣", 澄清: "传闻/辟谣",
  上市: "IPO/新股", 新股: "IPO/新股", 招股书: "IPO/新股", ipo: "IPO/新股",
  收购: "并购重组", 合并: "并购重组", 重组: "并购重组", 借壳: "并购重组", 要约: "并购重组",
  行情: "行情/资金", 大盘: "指数", 股指: "指数", 板块: "行情/资金", 异动: "行情/资金",
  半导体: "半导体", 芯片: "半导体", 集成电路: "半导体",
  新能源: "新能源", 光伏: "新能源", 锂电: "新能源", 储能: "新能源",
  医药: "医药生物", 创新药: "医药生物", 生物医药: "医药生物",
  白酒: "消费", 食品饮料: "消费",
  银行: "金融", 保险: "金融", 券商: "金融", 证券: "金融",
  房地产: "地产", 楼市: "地产",
  ai: "AI", 人工智能: "AI",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是公司自己的其他称呼（官方账号名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  moutai: { name: "贵州茅台", displayTag: "贵州茅台", aliases: ["贵州茅台", "茅台", "Moutai", "Kweichow Moutai"] },
  catl: { name: "宁德时代", displayTag: "宁德时代", aliases: ["宁德时代", "CATL", "Contemporary Amperex"] },
  byd: { name: "比亚迪", displayTag: "比亚迪", aliases: ["比亚迪", "BYD"] },
  smic: { name: "中芯国际", displayTag: "中芯国际", aliases: ["中芯国际", "SMIC"] },
  tencent: { name: "腾讯控股", displayTag: "腾讯控股", aliases: ["腾讯", "腾讯控股", "Tencent"], otherNames: ["Tencent Holdings"] },
  alibaba: { name: "阿里巴巴", displayTag: "阿里巴巴", aliases: ["阿里巴巴", "阿里", "Alibaba"], otherNames: ["BABA"] },
  meituan: { name: "美团", displayTag: "美团", aliases: ["美团", "Meituan"], otherNames: ["美团点评"] },
  nvidia: { name: "英伟达", displayTag: "英伟达", aliases: ["英伟达", "NVIDIA", "Nvidia"] },
  apple: { name: "苹果", displayTag: "苹果", aliases: ["苹果", "Apple"] },
  microsoft: { name: "微软", displayTag: "微软", aliases: ["微软", "Microsoft"] },
  tesla: { name: "特斯拉", displayTag: "特斯拉", aliases: ["特斯拉", "Tesla"] },
  amazon: { name: "亚马逊", displayTag: "亚马逊", aliases: ["亚马逊", "Amazon"], otherNames: ["AWS"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "moutai", name: "贵州茅台", patterns: [/贵州茅台|茅台|\bmoutai\b/i] },
  { id: "catl", name: "宁德时代", patterns: [/宁德时代|\bcatl\b|时代电服/i] },
  { id: "byd", name: "比亚迪", patterns: [/比亚迪|\bbyd\b/i] },
  { id: "smic", name: "中芯国际", patterns: [/中芯国际|\bsmic\b/i] },
  { id: "tencent", name: "腾讯控股", patterns: [/腾讯|tencent/i] },
  { id: "alibaba", name: "阿里巴巴", patterns: [/阿里巴巴|alibaba|\bbaba\b/i] },
  { id: "meituan", name: "美团", patterns: [/美团|meituan/i] },
  { id: "nvidia", name: "英伟达", patterns: [/英伟达|nvidia/i] },
  { id: "apple", name: "苹果", patterns: [/苹果(公司|股价|财报|发布会)|\bapple\b|iphone|ipad|macbook/i] },
  { id: "microsoft", name: "微软", patterns: [/微软|microsoft/i] },
  { id: "tesla", name: "特斯拉", patterns: [/特斯拉|tesla/i] },
  { id: "amazon", name: "亚马逊", patterns: [/亚马逊|amazon/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "nvidia", domains: ["nvidia.com"] },
  { entityId: "apple", domains: ["apple.com"] },
  { entityId: "microsoft", domains: ["microsoft.com"] },
  { entityId: "tesla", domains: ["tesla.com"] },
  { entityId: "amazon", domains: ["amazon.com"] },
  { entityId: "tencent", domains: ["tencent.com"] },
  { entityId: "alibaba", domains: ["alibaba.com", "alibabacloud.com"] },
  { entityId: "byd", domains: ["bydglobal.com", "byd.com"] },
  { entityId: "meituan", domains: ["meituan.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "amazon", pattern: /\bAWS\b/ },
  { entityId: "moutai", pattern: /茅台集团/ },
];

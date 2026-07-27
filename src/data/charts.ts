export type Category =
  | "Comparison" | "Ranking" | "Time Series" | "Distribution"
  | "Relationship" | "Composition" | "Flow" | "Hierarchy"
  | "Maps" | "Machine Learning" | "Business" | "Statistical";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface CodeSample {
  library: "Matplotlib" | "Seaborn" | "Plotly";
  code: string;
  explanation: string;
}

export interface Chart {
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  summary: string;
  difficulty: Difficulty;
  whenToUse: string[];
  whenNotToUse: string[];
  businessExample: string;
  advantages: string[];
  limitations: string[];
  mistakes: string[];
  related: string[]; // slugs
  keywords: string[];
  code: CodeSample[];
  // preview archetype for rendering
  preview: "bar" | "groupedBar" | "stackedBar" | "hbar" | "lollipop" | "dot"
    | "line" | "area" | "stackedArea" | "step"
    | "histogram" | "density" | "violin" | "box"
    | "scatter" | "bubble" | "hexbin" | "heatmap" | "corr"
    | "treemap" | "sunburst" | "sankey" | "waterfall" | "funnel"
    | "radar" | "parallel" | "network" | "calendar" | "candlestick"
    | "gantt" | "timeline" | "choropleth" | "bubbleMap" | "flowMap"
    | "tree" | "confusion" | "roc" | "learning" | "featureImp"
    | "pca" | "cluster";
}

const py = (library: CodeSample["library"], code: string, explanation: string): CodeSample => ({ library, code, explanation });

export const CHARTS: Chart[] = [
  {
    slug: "bar-chart", name: "Bar Chart", category: "Comparison",
    tagline: "The workhorse of comparison.",
    summary: "Rectangular bars whose lengths encode a numeric value across a small set of categories. It is the most reliably decoded chart humans have.",
    difficulty: "Beginner",
    whenToUse: ["Comparing values across categories", "Small to medium number of categories (3–20)", "Exact values matter"],
    whenNotToUse: ["Showing part-to-whole totals (use stacked or a composition chart)", "Continuous data over time (use a line chart)", "Hundreds of categories (use a horizontal bar or dot plot)"],
    businessExample: "Revenue per product line for the last quarter, ranked so the largest bar is instantly recognisable.",
    advantages: ["Effortless to read", "Works for anyone, no training needed", "Precise value comparison"],
    limitations: ["Loses meaning past ~20 categories", "Doesn't show trends over time well", "Colour adds no extra information"],
    mistakes: ["Starting the y-axis above zero", "Sorting alphabetically instead of by value", "Using 3D bars"],
    related: ["horizontal-bar", "lollipop-chart", "grouped-bar", "dot-plot"],
    keywords: ["bar", "column", "compare", "categories", "ranking"],
    preview: "bar",
    code: [
      py("Matplotlib", `import matplotlib.pyplot as plt

categories = ["A", "B", "C", "D"]
values = [23, 45, 17, 34]

plt.bar(categories, values, color="#7c3aed")
plt.title("Sales by category")
plt.ylabel("Units sold")
plt.show()`, "The simplest possible bar chart — matplotlib handles axes for you."),
      py("Seaborn", `import seaborn as sns
import pandas as pd

df = pd.DataFrame({"cat": ["A","B","C","D"], "val": [23,45,17,34]})
sns.barplot(data=df, x="cat", y="val", color="#7c3aed")`, "Seaborn integrates with dataframes and gives clean defaults."),
      py("Plotly", `import plotly.express as px

fig = px.bar(x=["A","B","C","D"], y=[23,45,17,34], color_discrete_sequence=["#7c3aed"])
fig.show()`, "Plotly makes it interactive out of the box — hover for exact values."),
    ],
  },
  {
    slug: "grouped-bar", name: "Grouped Bar", category: "Comparison",
    tagline: "Compare categories across sub-groups.",
    summary: "Bars for each sub-category placed side-by-side within a group. Great when you want to compare the same categories across a second dimension.",
    difficulty: "Beginner",
    whenToUse: ["Two categorical dimensions", "Small number of groups AND sub-groups"],
    whenNotToUse: ["More than 4 sub-groups (becomes cluttered)"],
    businessExample: "Revenue per region, broken down by product line.",
    advantages: ["Clear comparison within and across groups", "Preserves exact values"],
    limitations: ["Doesn't show totals", "Cluttered with many sub-groups"],
    mistakes: ["Too many colours", "Legend order not matching bar order"],
    related: ["stacked-bar", "bar-chart", "dot-plot"],
    keywords: ["grouped", "clustered", "side by side", "compare"],
    preview: "groupedBar",
    code: [
      py("Matplotlib", `import numpy as np, matplotlib.pyplot as plt

x = np.arange(4)
a = [23, 45, 17, 34]; b = [30, 25, 40, 22]
plt.bar(x-0.2, a, 0.4, label="2023")
plt.bar(x+0.2, b, 0.4, label="2024")
plt.xticks(x, ["A","B","C","D"]); plt.legend(); plt.show()`, "Manual offsets keep bars side-by-side."),
      py("Seaborn", `import seaborn as sns, pandas as pd
df = pd.DataFrame({"cat":["A","B","C","D"]*2, "year":["2023"]*4+["2024"]*4, "val":[23,45,17,34,30,25,40,22]})
sns.barplot(data=df, x="cat", y="val", hue="year")`, "Seaborn uses `hue` to add the second dimension."),
      py("Plotly", `import plotly.express as px
df = {"cat":["A","B","C","D"]*2, "year":["2023"]*4+["2024"]*4, "val":[23,45,17,34,30,25,40,22]}
px.bar(df, x="cat", y="val", color="year", barmode="group").show()`, "`barmode='group'` is the key parameter."),
    ],
  },
  {
    slug: "stacked-bar", name: "Stacked Bar", category: "Composition",
    tagline: "Parts within a whole, across categories.",
    summary: "Bars segmented to show composition. Total is preserved, but only the bottom slice can be compared accurately.",
    difficulty: "Beginner",
    whenToUse: ["Composition matters and totals matter", "Few sub-categories (2–5)"],
    whenNotToUse: ["Comparing individual sub-categories precisely (use grouped bar)"],
    businessExample: "Total revenue per region, split by product line.",
    advantages: ["Shows totals and parts", "Compact"],
    limitations: ["Hard to compare middle slices", "Loses precision quickly"],
    mistakes: ["Too many segments", "Unordered stacking"],
    related: ["grouped-bar", "bar-chart", "treemap"],
    keywords: ["stacked", "composition", "parts"],
    preview: "stackedBar",
    code: [
      py("Matplotlib", `import matplotlib.pyplot as plt
cats=["A","B","C","D"]; a=[10,20,15,25]; b=[15,10,20,10]
plt.bar(cats,a,label="X"); plt.bar(cats,b,bottom=a,label="Y"); plt.legend()`, "`bottom=a` stacks Y on top of X."),
      py("Seaborn", `# Seaborn doesn't stack natively — pivot then matplotlib
import pandas as pd, matplotlib.pyplot as plt
df=pd.DataFrame({"cat":["A","B","C","D"],"X":[10,20,15,25],"Y":[15,10,20,10]}).set_index("cat")
df.plot(kind="bar", stacked=True)`, "pandas' plot API is the cleanest for stacked bars."),
      py("Plotly", `import plotly.express as px
df={"cat":["A","B","C","D"]*2,"grp":["X"]*4+["Y"]*4,"val":[10,20,15,25,15,10,20,10]}
px.bar(df,x="cat",y="val",color="grp").show()`, "Plotly stacks by default when `barmode` is omitted."),
    ],
  },
  {
    slug: "horizontal-bar", name: "Horizontal Bar", category: "Ranking",
    tagline: "Ranked bars, sideways, for long labels.",
    summary: "Same as a bar chart, rotated 90°. The best choice when category names are long or when you have many categories to rank.",
    difficulty: "Beginner",
    whenToUse: ["Long category labels", "Ranking many items", "Small screens"],
    whenNotToUse: ["Categorical values already short", "Time series"],
    businessExample: "Top 15 customers by annual revenue.",
    advantages: ["Labels never rotate", "Easy to rank"],
    limitations: ["Vertical space grows with categories"],
    mistakes: ["Random ordering — always sort by value"],
    related: ["bar-chart", "lollipop-chart", "dot-plot"],
    keywords: ["horizontal", "ranking", "top n"],
    preview: "hbar",
    code: [
      py("Matplotlib", `plt.barh(["Alpha","Beta","Gamma"], [12,25,8])`, "Just use `barh` instead of `bar`."),
      py("Seaborn", `sns.barplot(data=df, x="value", y="label", orient="h")`, "Swap x/y and set orient."),
      py("Plotly", `px.bar(df, x="value", y="label", orientation="h")`, "`orientation='h'` flips it."),
    ],
  },
  {
    slug: "lollipop-chart", name: "Lollipop Chart", category: "Ranking",
    tagline: "Bar chart on a diet.",
    summary: "A line with a dot at the end. Less visual weight than a bar chart, which lets you compare many items without ink overload.",
    difficulty: "Intermediate",
    whenToUse: ["Ranking 20+ items", "You want an elegant, less heavy look"],
    whenNotToUse: ["Precise comparison of similar values"],
    businessExample: "Ranked employee NPS scores across 30 teams.",
    advantages: ["Elegant", "Reduces ink", "Handles many categories"],
    limitations: ["Slightly less precise than bars"],
    mistakes: ["Using thin lines that disappear on print"],
    related: ["horizontal-bar", "dot-plot", "bar-chart"],
    keywords: ["lollipop", "ranking", "elegant"],
    preview: "lollipop",
    code: [
      py("Matplotlib", `plt.hlines(y=df.cat, xmin=0, xmax=df.val)
plt.plot(df.val, df.cat, "o")`, "hlines for the sticks, dots for the candy."),
      py("Seaborn", `# Combine seaborn stripplot with matplotlib hlines
sns.stripplot(data=df, x="val", y="cat")`, "Seaborn doesn't ship a lollipop primitive; combine it."),
      py("Plotly", `import plotly.graph_objects as go
fig = go.Figure(go.Scatter(x=df.val, y=df.cat, mode="markers"))
for _,r in df.iterrows(): fig.add_shape(type="line", x0=0, x1=r.val, y0=r.cat, y1=r.cat)`, "Draw a line shape per row plus a scatter for dots."),
    ],
  },
  {
    slug: "dot-plot", name: "Dot Plot", category: "Comparison",
    tagline: "Precision without ink.",
    summary: "A single dot per category. Superb for comparing many values compactly.",
    difficulty: "Beginner",
    whenToUse: ["Many categories", "Comparing two related values (Cleveland dot plot)"],
    whenNotToUse: ["Very few categories (bars are friendlier)"],
    businessExample: "Median salary comparison across 40 job titles.",
    advantages: ["High data-ink ratio", "Scales to many rows"],
    limitations: ["Requires viewer familiarity"],
    mistakes: ["Using the same colour for two comparison dots"],
    related: ["lollipop-chart", "horizontal-bar"],
    keywords: ["dot", "cleveland", "compare"],
    preview: "dot",
    code: [
      py("Matplotlib", `plt.plot(df.val, df.cat, "o")`, "Just markers, no line."),
      py("Seaborn", `sns.pointplot(data=df, x="val", y="cat", join=False)`, "`join=False` removes the connecting line."),
      py("Plotly", `px.scatter(df, x="val", y="cat")`, "Scatter with a categorical y-axis becomes a dot plot."),
    ],
  },
  {
    slug: "line-chart", name: "Line Chart", category: "Time Series",
    tagline: "Trends over time, at a glance.",
    summary: "Points connected by lines. The definitive chart for continuous data — especially time.",
    difficulty: "Beginner",
    whenToUse: ["Continuous data, especially time series", "Showing trends and change"],
    whenNotToUse: ["Categorical data", "Very few data points"],
    businessExample: "Monthly active users over the past 24 months.",
    advantages: ["Instantly reveals trend and momentum", "Handles many points"],
    limitations: ["Hides individual observations", "Cluttered with too many series"],
    mistakes: ["Truncated y-axis that exaggerates change", "More than ~6 lines on one chart"],
    related: ["area-chart", "step-chart", "candlestick-chart"],
    keywords: ["line", "trend", "time"],
    preview: "line",
    code: [
      py("Matplotlib", `plt.plot(x, y, marker="o")`, "The default line style with markers."),
      py("Seaborn", `sns.lineplot(data=df, x="date", y="val")`, "Handles confidence intervals automatically if data is repeated."),
      py("Plotly", `px.line(df, x="date", y="val")`, "Interactive hover shows exact values."),
    ],
  },
  {
    slug: "area-chart", name: "Area Chart", category: "Time Series",
    tagline: "A line with weight.",
    summary: "A filled line chart. Emphasises the magnitude of change over time.",
    difficulty: "Beginner",
    whenToUse: ["Emphasising volume or magnitude over time", "A single series"],
    whenNotToUse: ["Multiple overlapping series (use stacked area or lines)"],
    businessExample: "Cumulative signups since launch.",
    advantages: ["Communicates magnitude", "Visually striking"],
    limitations: ["Overlapping series become opaque"],
    mistakes: ["Solid opaque overlapping series"],
    related: ["line-chart", "stacked-area", "step-chart"],
    keywords: ["area", "filled", "magnitude"],
    preview: "area",
    code: [
      py("Matplotlib", `plt.fill_between(x, y, alpha=0.4); plt.plot(x, y)`, "Fill under the line."),
      py("Seaborn", `# Seaborn has no native area; combine lineplot + fill_between`, "Use matplotlib primitives."),
      py("Plotly", `px.area(df, x="date", y="val")`, "First-class in Plotly."),
    ],
  },
  {
    slug: "stacked-area", name: "Stacked Area", category: "Composition",
    tagline: "Composition, but with a heartbeat.",
    summary: "Multiple area charts stacked to show how the composition changes over time.",
    difficulty: "Intermediate",
    whenToUse: ["Composition over time"],
    whenNotToUse: ["Comparing individual series' shape"],
    businessExample: "Revenue split by product line, month over month.",
    advantages: ["Shows totals and composition"],
    limitations: ["Middle series' shape is hard to read"],
    mistakes: ["Too many stacked series"],
    related: ["area-chart", "stacked-bar", "line-chart"],
    keywords: ["stacked", "area", "over time"],
    preview: "stackedArea",
    code: [
      py("Matplotlib", `plt.stackplot(x, y1, y2, y3, labels=["A","B","C"])`, "One function, done."),
      py("Seaborn", `# use pandas: df.plot.area(stacked=True)`, "pandas is easiest."),
      py("Plotly", `px.area(df, x="date", y="val", color="grp")`, "Add color to stack."),
    ],
  },
  {
    slug: "step-chart", name: "Step Chart", category: "Time Series",
    tagline: "Change happens in jumps.",
    summary: "A line chart with horizontal segments — perfect for values that change discretely rather than continuously.",
    difficulty: "Intermediate",
    whenToUse: ["Prices, inventory levels, discrete state changes"],
    whenNotToUse: ["Smoothly-varying data"],
    businessExample: "Subscription tier changes over time.",
    advantages: ["Honest about when change occurred"],
    limitations: ["Less common — needs a legend"],
    mistakes: ["Using it for continuous data"],
    related: ["line-chart", "candlestick-chart"],
    keywords: ["step", "staircase", "discrete"],
    preview: "step",
    code: [
      py("Matplotlib", `plt.step(x, y, where="post")`, "'post' means value changes at the point."),
      py("Seaborn", `# not native, use matplotlib`, ""),
      py("Plotly", `px.line(df, x="date", y="val", line_shape="hv")`, "`hv` gives horizontal-then-vertical steps."),
    ],
  },
  {
    slug: "histogram", name: "Histogram", category: "Distribution",
    tagline: "The shape of your data.",
    summary: "Buckets numeric values into bins and shows the count in each. Reveals distribution shape, spread, and outliers.",
    difficulty: "Beginner",
    whenToUse: ["Understanding distribution of a numeric variable"],
    whenNotToUse: ["Categorical data (that's a bar chart)"],
    businessExample: "Distribution of order values to spot pricing thresholds.",
    advantages: ["Reveals shape (skew, modality)", "Highlights outliers"],
    limitations: ["Bin size changes the story"],
    mistakes: ["Auto bin count that hides structure"],
    related: ["density-plot", "box-plot", "violin-plot"],
    keywords: ["histogram", "distribution", "bins"],
    preview: "histogram",
    code: [
      py("Matplotlib", `plt.hist(data, bins=30)`, "Tweak `bins` until you see structure."),
      py("Seaborn", `sns.histplot(data, bins=30, kde=True)`, "`kde=True` overlays a density curve."),
      py("Plotly", `px.histogram(df, x="value", nbins=30)`, "Interactive binning."),
    ],
  },
  {
    slug: "density-plot", name: "Density Plot", category: "Distribution",
    tagline: "A smoothed histogram.",
    summary: "A kernel density estimate — a smoothed curve of the distribution. Elegant when you want to compare multiple distributions.",
    difficulty: "Intermediate",
    whenToUse: ["Comparing several distributions", "You want a smoother look than a histogram"],
    whenNotToUse: ["You need exact counts"],
    businessExample: "Compare age distributions across three customer segments.",
    advantages: ["Smooth", "Great for overlaying"],
    limitations: ["Bandwidth changes the story", "Not intuitive for non-technical viewers"],
    mistakes: ["Ignoring bandwidth choice"],
    related: ["histogram", "violin-plot"],
    keywords: ["density", "kde", "distribution"],
    preview: "density",
    code: [
      py("Matplotlib", `# via scipy or seaborn — matplotlib has no native KDE`, ""),
      py("Seaborn", `sns.kdeplot(data=df, x="value", hue="group")`, "Multiple densities in one line."),
      py("Plotly", `import plotly.figure_factory as ff
ff.create_distplot([data], ["value"])`, "Distplot combines histogram and KDE."),
    ],
  },
  {
    slug: "violin-plot", name: "Violin Plot", category: "Distribution",
    tagline: "A box plot's expressive cousin.",
    summary: "A mirrored density plot showing distribution shape on each side. Compares distributions across categories richly.",
    difficulty: "Intermediate",
    whenToUse: ["Comparing distribution shapes across categories"],
    whenNotToUse: ["Non-technical audiences unfamiliar with the shape"],
    businessExample: "Salary distributions across departments.",
    advantages: ["Shows shape and spread"],
    limitations: ["Requires enough data per group", "Unfamiliar to many"],
    mistakes: ["Using with tiny samples"],
    related: ["box-plot", "density-plot"],
    keywords: ["violin", "distribution", "shape"],
    preview: "violin",
    code: [
      py("Matplotlib", `plt.violinplot(data_groups)`, "Pass a list of arrays."),
      py("Seaborn", `sns.violinplot(data=df, x="group", y="value")`, "The cleanest API."),
      py("Plotly", `px.violin(df, x="group", y="value", box=True)`, "`box=True` overlays a box plot."),
    ],
  },
  {
    slug: "box-plot", name: "Box Plot", category: "Distribution",
    tagline: "Five numbers, one glance.",
    summary: "Shows median, quartiles, and outliers. The five-number summary for comparing distributions compactly.",
    difficulty: "Beginner",
    whenToUse: ["Comparing distributions across categories", "Highlighting outliers"],
    whenNotToUse: ["Small samples", "You need shape details"],
    businessExample: "Response time distribution across API endpoints.",
    advantages: ["Compact", "Highlights outliers"],
    limitations: ["Hides multi-modal distributions"],
    mistakes: ["Not explaining what the box represents"],
    related: ["violin-plot", "histogram"],
    keywords: ["box", "whisker", "quartile"],
    preview: "box",
    code: [
      py("Matplotlib", `plt.boxplot([g1, g2, g3])`, "Pass groups as a list."),
      py("Seaborn", `sns.boxplot(data=df, x="group", y="value")`, "Cleanest defaults."),
      py("Plotly", `px.box(df, x="group", y="value")`, "Hover shows each summary stat."),
    ],
  },
  {
    slug: "scatter-plot", name: "Scatter Plot", category: "Relationship",
    tagline: "Where two variables meet.",
    summary: "One dot per observation, positioned by two numeric variables. Reveals correlation, clusters, and outliers.",
    difficulty: "Beginner",
    whenToUse: ["Relationship between two numeric variables", "Spotting clusters or outliers"],
    whenNotToUse: ["Categorical data", "Very few points"],
    businessExample: "Ad spend vs revenue per campaign.",
    advantages: ["Reveals structure", "Handles many points"],
    limitations: ["Overplotting with dense data (use hexbin)"],
    mistakes: ["Assuming correlation implies causation"],
    related: ["bubble-chart", "hexbin", "heatmap"],
    keywords: ["scatter", "correlation", "relationship"],
    preview: "scatter",
    code: [
      py("Matplotlib", `plt.scatter(x, y, alpha=0.5)`, "Alpha helps with overlap."),
      py("Seaborn", `sns.scatterplot(data=df, x="x", y="y", hue="cat")`, "Colour by category."),
      py("Plotly", `px.scatter(df, x="x", y="y", color="cat")`, "Zoom and hover included."),
    ],
  },
  {
    slug: "bubble-chart", name: "Bubble Chart", category: "Relationship",
    tagline: "Scatter plot with a third dimension.",
    summary: "A scatter plot where dot size encodes a third variable. Powerful, but risk of misreading area.",
    difficulty: "Intermediate",
    whenToUse: ["Three numeric variables, one shown by size"],
    whenNotToUse: ["Precise size comparison"],
    businessExample: "Country GDP (x) vs Life Expectancy (y) with Population as bubble size.",
    advantages: ["Compact three-variable view"],
    limitations: ["Humans underestimate area differences"],
    mistakes: ["Encoding size by radius instead of area"],
    related: ["scatter-plot", "bubble-map"],
    keywords: ["bubble", "three variables"],
    preview: "bubble",
    code: [
      py("Matplotlib", `plt.scatter(x, y, s=sizes)`, "`s` scales the marker."),
      py("Seaborn", `sns.scatterplot(data=df, x="x", y="y", size="pop")`, "Pass a column to `size`."),
      py("Plotly", `px.scatter(df, x="x", y="y", size="pop", color="continent")`, "Add colour for a fourth dimension."),
    ],
  },
  {
    slug: "hexbin", name: "Hexbin", category: "Relationship",
    tagline: "Scatter, uncrowded.",
    summary: "Bins two-dimensional data into hexagonal cells coloured by count. The cure for scatter plot overplotting.",
    difficulty: "Intermediate",
    whenToUse: ["Very dense scatter data"],
    whenNotToUse: ["Small datasets"],
    businessExample: "Millions of user events plotted by lat/lng.",
    advantages: ["Reveals density"],
    limitations: ["Loses individual points"],
    mistakes: ["Sequential colour scheme reversed"],
    related: ["scatter-plot", "heatmap"],
    keywords: ["hexbin", "density", "overplot"],
    preview: "hexbin",
    code: [
      py("Matplotlib", `plt.hexbin(x, y, gridsize=30)`, "`gridsize` controls resolution."),
      py("Seaborn", `sns.jointplot(x=x, y=y, kind="hex")`, "Adds marginal distributions."),
      py("Plotly", `# no native hexbin; use density_heatmap`, ""),
    ],
  },
  {
    slug: "heatmap", name: "Heatmap", category: "Relationship",
    tagline: "A matrix, coloured.",
    summary: "A grid of cells coloured by value. Ideal for showing patterns across two categorical dimensions.",
    difficulty: "Beginner",
    whenToUse: ["Two categorical dimensions with a numeric measure", "Correlation matrices"],
    whenNotToUse: ["When exact values matter"],
    businessExample: "Traffic by day-of-week × hour-of-day.",
    advantages: ["Reveals patterns quickly"],
    limitations: ["Colour choice is critical"],
    mistakes: ["Using a rainbow colour scale"],
    related: ["corr", "calendar-heatmap"],
    keywords: ["heatmap", "matrix", "pattern"],
    preview: "heatmap",
    code: [
      py("Matplotlib", `plt.imshow(matrix, cmap="viridis")`, "Viridis is perceptually uniform."),
      py("Seaborn", `sns.heatmap(matrix, annot=True, cmap="rocket")`, "`annot` writes numbers in cells."),
      py("Plotly", `px.imshow(matrix)`, "Interactive tooltips per cell."),
    ],
  },
  {
    slug: "correlation-matrix", name: "Correlation Matrix", category: "Statistical",
    tagline: "Every variable, meet every other.",
    summary: "A heatmap of pairwise correlations. The starting point for any regression analysis.",
    difficulty: "Intermediate",
    whenToUse: ["Feature selection", "Exploratory analysis"],
    whenNotToUse: ["Categorical data"],
    businessExample: "Which product metrics move together with retention?",
    advantages: ["Reveals relationships at a glance"],
    limitations: ["Only captures linear relationships"],
    mistakes: ["Using it with categorical variables"],
    related: ["heatmap", "scatter-plot"],
    keywords: ["correlation", "matrix", "features"],
    preview: "corr",
    code: [
      py("Matplotlib", `plt.imshow(df.corr(), cmap="coolwarm", vmin=-1, vmax=1)`, "Symmetric colour scale is essential."),
      py("Seaborn", `sns.heatmap(df.corr(), annot=True, cmap="coolwarm", center=0)`, "`center=0` anchors the diverging palette."),
      py("Plotly", `px.imshow(df.corr(), color_continuous_scale="RdBu", zmin=-1, zmax=1)`, "Diverging scale for -1..1."),
    ],
  },
  {
    slug: "treemap", name: "Treemap", category: "Hierarchy",
    tagline: "Space-filling composition.",
    summary: "Nested rectangles whose area encodes a value. Great for hierarchical composition when you have many parts.",
    difficulty: "Intermediate",
    whenToUse: ["Hierarchical composition", "Many parts within categories"],
    whenNotToUse: ["Deep hierarchies (use sunburst)"],
    businessExample: "Revenue by product category, sized by contribution.",
    advantages: ["Uses space efficiently"],
    limitations: ["Small rectangles are hard to label"],
    mistakes: ["Too many colours"],
    related: ["sunburst", "stacked-bar"],
    keywords: ["treemap", "hierarchy", "composition"],
    preview: "treemap",
    code: [
      py("Matplotlib", `import squarify
squarify.plot(sizes=vals, label=labels)`, "`squarify` is the go-to package."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `px.treemap(df, path=["cat","sub"], values="val")`, "Interactive drill-down."),
    ],
  },
  {
    slug: "sunburst", name: "Sunburst", category: "Hierarchy",
    tagline: "A pie chart with generations.",
    summary: "Concentric rings representing a hierarchy. Radial cousin of the treemap.",
    difficulty: "Advanced",
    whenToUse: ["Multi-level hierarchies"],
    whenNotToUse: ["Precise comparisons"],
    businessExample: "Website navigation paths — section → page → action.",
    advantages: ["Beautiful", "Shows depth"],
    limitations: ["Hard to read outer rings"],
    mistakes: ["Too many levels"],
    related: ["treemap"],
    keywords: ["sunburst", "hierarchy", "radial"],
    preview: "sunburst",
    code: [
      py("Matplotlib", `# not straightforward; use plotly`, ""),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `px.sunburst(df, path=["cat","sub","leaf"], values="val")`, "Interactive click-to-zoom."),
    ],
  },
  {
    slug: "sankey", name: "Sankey Diagram", category: "Flow",
    tagline: "Where things go.",
    summary: "Flows between nodes, with widths proportional to volume. Powerful for showing how quantities split or merge.",
    difficulty: "Advanced",
    whenToUse: ["Flows between categories (user journeys, energy)"],
    whenNotToUse: ["Simple part-to-whole (use pie/bar)"],
    businessExample: "User journey from landing page to conversion.",
    advantages: ["Shows flow volumes", "Reveals bottlenecks"],
    limitations: ["Complex to configure"],
    mistakes: ["Too many nodes"],
    related: ["funnel-chart", "flow-map"],
    keywords: ["sankey", "flow", "journey"],
    preview: "sankey",
    code: [
      py("Matplotlib", `from matplotlib.sankey import Sankey
Sankey(flows=[0.25,0.15,-0.4]).finish()`, "Native but limited."),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `import plotly.graph_objects as go
go.Figure(go.Sankey(node=dict(label=[...]), link=dict(source=[...], target=[...], value=[...])))`, "The industry standard for Sankeys."),
    ],
  },
  {
    slug: "waterfall", name: "Waterfall Chart", category: "Business",
    tagline: "Show how you got from A to B.",
    summary: "Vertical bars showing sequential positive and negative contributions to a running total.",
    difficulty: "Intermediate",
    whenToUse: ["Financial variance analysis", "Breaking down change"],
    whenNotToUse: ["Non-sequential data"],
    businessExample: "Revenue bridge: Q1 → Q2 with wins, losses, upsells.",
    advantages: ["Business-native", "Clear narrative"],
    limitations: ["Requires a defined start and end"],
    mistakes: ["Missing subtotal bars"],
    related: ["bar-chart", "funnel-chart"],
    keywords: ["waterfall", "bridge", "finance"],
    preview: "waterfall",
    code: [
      py("Matplotlib", `# custom: use plt.bar with bottom offsets`, "You'll write the bar offsets yourself."),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `import plotly.graph_objects as go
go.Figure(go.Waterfall(x=labels, y=values, measure=["relative"]*len(values)))`, "First-class in Plotly."),
    ],
  },
  {
    slug: "funnel-chart", name: "Funnel Chart", category: "Business",
    tagline: "Stages, dropping off.",
    summary: "Sequential horizontal bars decreasing in size. Standard for conversion analysis.",
    difficulty: "Beginner",
    whenToUse: ["Conversion funnels", "Sales pipelines"],
    whenNotToUse: ["Non-sequential categories"],
    businessExample: "Signup → activate → subscribe → renew.",
    advantages: ["Immediately understandable"],
    limitations: ["Only monotonic decreases"],
    mistakes: ["Using it for non-funnel data"],
    related: ["waterfall", "sankey"],
    keywords: ["funnel", "conversion", "sales"],
    preview: "funnel",
    code: [
      py("Matplotlib", `# custom horizontal bars centered`, ""),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `import plotly.graph_objects as go
go.Figure(go.Funnel(y=stages, x=values))`, "Handles the geometry for you."),
    ],
  },
  {
    slug: "radar-chart", name: "Radar Chart", category: "Comparison",
    tagline: "Compare across many dimensions.",
    summary: "A polygonal shape connecting values on multiple axes. Great for profile comparison but often misused.",
    difficulty: "Intermediate",
    whenToUse: ["Comparing entities across 4–8 dimensions"],
    whenNotToUse: ["Precise comparison", "Many entities"],
    businessExample: "Comparing two vendors across support, price, features, reliability, integrations, docs.",
    advantages: ["Compact multi-dimensional view"],
    limitations: ["Axis order changes the shape"],
    mistakes: ["Filling with opaque colour"],
    related: ["parallel-coordinates"],
    keywords: ["radar", "spider", "multi-dimensional"],
    preview: "radar",
    code: [
      py("Matplotlib", `# use polar projection
ax = plt.subplot(111, polar=True); ax.plot(theta, r)`, "Polar plot with matching angles."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `import plotly.graph_objects as go
go.Figure(go.Scatterpolar(r=vals, theta=dims, fill="toself"))`, "One-liner."),
    ],
  },
  {
    slug: "parallel-coordinates", name: "Parallel Coordinates", category: "Relationship",
    tagline: "Trace observations across dimensions.",
    summary: "Each observation is a line crossing parallel axes. Reveals multi-dimensional patterns.",
    difficulty: "Advanced",
    whenToUse: ["Multi-dimensional numeric data", "Feature engineering"],
    whenNotToUse: ["Non-technical audience"],
    businessExample: "Comparing wine attributes: acidity, sugar, alcohol, quality.",
    advantages: ["Multi-dimensional at once"],
    limitations: ["Cluttered with many rows"],
    mistakes: ["Axes not normalised"],
    related: ["radar-chart", "scatter-plot"],
    keywords: ["parallel", "coordinates", "multi-dim"],
    preview: "parallel",
    code: [
      py("Matplotlib", `from pandas.plotting import parallel_coordinates
parallel_coordinates(df, "class")`, "pandas provides a helper."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `px.parallel_coordinates(df, color="quality")`, "Interactive brushing on any axis."),
    ],
  },
  {
    slug: "network-graph", name: "Network Graph", category: "Flow",
    tagline: "Nodes, edges, meaning.",
    summary: "Nodes connected by edges. For relationships between entities.",
    difficulty: "Advanced",
    whenToUse: ["Social networks, dependencies, citations"],
    whenNotToUse: ["Ordered or numeric data"],
    businessExample: "Team collaboration graph from communication data.",
    advantages: ["Reveals structure"],
    limitations: ["Layout is an art"],
    mistakes: ["Too many labels overlapping"],
    related: ["sankey", "tree"],
    keywords: ["network", "graph", "nodes"],
    preview: "network",
    code: [
      py("Matplotlib", `import networkx as nx
nx.draw(G, with_labels=True)`, "networkx handles both algorithms and drawing."),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `# combine networkx layouts with plotly scatter`, ""),
    ],
  },
  {
    slug: "calendar-heatmap", name: "Calendar Heatmap", category: "Time Series",
    tagline: "GitHub-style contribution grid.",
    summary: "A calendar coloured by daily values. The GitHub contribution graph, in your codebase.",
    difficulty: "Intermediate",
    whenToUse: ["Daily activity over months or years"],
    whenNotToUse: ["Sparse events"],
    businessExample: "Daily deployment frequency across the year.",
    advantages: ["Compact, familiar"],
    limitations: ["One value per day"],
    mistakes: ["Non-sequential palette"],
    related: ["heatmap", "line-chart"],
    keywords: ["calendar", "heatmap", "daily"],
    preview: "calendar",
    code: [
      py("Matplotlib", `import calmap
calmap.yearplot(series)`, "`calmap` is the classic."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `# via plotly heatmap with reshaped dates`, ""),
    ],
  },
  {
    slug: "candlestick-chart", name: "Candlestick Chart", category: "Time Series",
    tagline: "OHLC, at a glance.",
    summary: "Open-High-Low-Close bars used for financial data. Rich per-period detail.",
    difficulty: "Intermediate",
    whenToUse: ["OHLC price data", "Trading analysis"],
    whenNotToUse: ["Non-financial data"],
    businessExample: "Daily stock price for the last quarter.",
    advantages: ["Four values per period"],
    limitations: ["Requires OHLC data"],
    mistakes: ["Colour convention differs by region"],
    related: ["line-chart", "step-chart"],
    keywords: ["candlestick", "ohlc", "finance"],
    preview: "candlestick",
    code: [
      py("Matplotlib", `import mplfinance as mpf
mpf.plot(df, type="candle")`, "`mplfinance` handles conventions."),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `import plotly.graph_objects as go
go.Figure(go.Candlestick(x=df.date, open=df.o, high=df.h, low=df.l, close=df.c))`, "Interactive zoom is essential for finance."),
    ],
  },
  {
    slug: "gantt-chart", name: "Gantt Chart", category: "Business",
    tagline: "Time as bars.",
    summary: "Horizontal bars along a timeline. The project management staple.",
    difficulty: "Intermediate",
    whenToUse: ["Project schedules", "Task dependencies"],
    whenNotToUse: ["Numeric comparisons"],
    businessExample: "Sprint plan with 12 tasks, owners, and dependencies.",
    advantages: ["Schedule at a glance"],
    limitations: ["Doesn't scale to hundreds of tasks"],
    mistakes: ["Missing today's date marker"],
    related: ["timeline", "waterfall"],
    keywords: ["gantt", "project", "schedule"],
    preview: "gantt",
    code: [
      py("Matplotlib", `plt.barh(y=tasks, width=durations, left=starts)`, "Just horizontal bars with offsets."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `px.timeline(df, x_start="start", x_end="end", y="task")`, "First-class in Plotly."),
    ],
  },
  {
    slug: "timeline", name: "Timeline", category: "Time Series",
    tagline: "Events on a line.",
    summary: "Discrete events plotted along a horizontal or vertical axis.",
    difficulty: "Beginner",
    whenToUse: ["Historical events", "Project milestones"],
    whenNotToUse: ["Continuous data"],
    businessExample: "Product release history.",
    advantages: ["Story-telling"],
    limitations: ["Not for aggregate analysis"],
    mistakes: ["Uneven spacing implying uneven time"],
    related: ["gantt-chart"],
    keywords: ["timeline", "events", "history"],
    preview: "timeline",
    code: [
      py("Matplotlib", `plt.stem(dates, [1]*len(dates))`, "Stem plot for events."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `px.scatter(df, x="date", y=[1]*len(df))`, "Scatter along a fixed y."),
    ],
  },
  {
    slug: "choropleth-map", name: "Choropleth Map", category: "Maps",
    tagline: "Colour the world.",
    summary: "Geographic regions coloured by a value. The classic election map.",
    difficulty: "Advanced",
    whenToUse: ["Values by administrative region"],
    whenNotToUse: ["Point data (use bubble map)"],
    businessExample: "Sales by US state.",
    advantages: ["Instantly geographic"],
    limitations: ["Larger regions look more important"],
    mistakes: ["Sequential palette for diverging data"],
    related: ["bubble-map", "heatmap"],
    keywords: ["choropleth", "map", "geography"],
    preview: "choropleth",
    code: [
      py("Matplotlib", `import geopandas as gpd
world.plot(column="pop", cmap="viridis")`, "geopandas is the standard."),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `px.choropleth(df, locations="iso", color="val")`, "Interactive with hover."),
    ],
  },
  {
    slug: "bubble-map", name: "Bubble Map", category: "Maps",
    tagline: "Point data, sized by value.",
    summary: "Circles on a map sized by a numeric value.",
    difficulty: "Advanced",
    whenToUse: ["Point-level geographic data with a numeric value"],
    whenNotToUse: ["Region-level data (use choropleth)"],
    businessExample: "Store locations sized by monthly revenue.",
    advantages: ["Precise location", "Value dimension"],
    limitations: ["Overlap in dense cities"],
    mistakes: ["Radius instead of area encoding"],
    related: ["choropleth-map", "bubble-chart"],
    keywords: ["bubble", "map", "locations"],
    preview: "bubbleMap",
    code: [
      py("Matplotlib", `# geopandas + scatter`, ""),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `px.scatter_geo(df, lat="lat", lon="lon", size="val")`, "One-liner geographic scatter."),
    ],
  },
  {
    slug: "flow-map", name: "Flow Map", category: "Maps",
    tagline: "Arrows across the world.",
    summary: "Lines or arrows connecting origins to destinations on a map.",
    difficulty: "Advanced",
    whenToUse: ["Migration, trade, flight routes"],
    whenNotToUse: ["Non-geographic flows (use sankey)"],
    businessExample: "Shipping routes from your warehouses to customers.",
    advantages: ["Geographic + relational"],
    limitations: ["Cluttered with many flows"],
    mistakes: ["Straight lines through geography"],
    related: ["sankey", "bubble-map"],
    keywords: ["flow", "map", "routes"],
    preview: "flowMap",
    code: [
      py("Matplotlib", `# custom line drawing per OD pair`, ""),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `import plotly.graph_objects as go
go.Figure(go.Scattergeo(lat=[la,lb], lon=[loa,lob], mode="lines"))`, "Add one trace per route."),
    ],
  },
  {
    slug: "decision-tree", name: "Decision Tree", category: "Machine Learning",
    tagline: "The model, visualised.",
    summary: "A tree diagram of splits made by a decision tree model. Perfect for explaining ML decisions.",
    difficulty: "Advanced",
    whenToUse: ["Explaining tree-based models", "Rule extraction"],
    whenNotToUse: ["Large trees (unreadable)"],
    businessExample: "Explaining a churn model to product managers.",
    advantages: ["Interpretable"],
    limitations: ["Deep trees are messy"],
    mistakes: ["Not pruning before plotting"],
    related: ["feature-importance", "confusion-matrix"],
    keywords: ["decision", "tree", "ml"],
    preview: "tree",
    code: [
      py("Matplotlib", `from sklearn.tree import plot_tree
plot_tree(model, feature_names=cols, filled=True)`, "scikit-learn ships a plotter."),
      py("Seaborn", `# not supported`, ""),
      py("Plotly", `# via dtreeviz or custom`, ""),
    ],
  },
  {
    slug: "confusion-matrix", name: "Confusion Matrix", category: "Machine Learning",
    tagline: "Where the model gets it wrong.",
    summary: "Rows = actual, columns = predicted. The starting point for classifier evaluation.",
    difficulty: "Intermediate",
    whenToUse: ["Classifier evaluation"],
    whenNotToUse: ["Regression"],
    businessExample: "Which fraud cases the model missed vs flagged incorrectly.",
    advantages: ["Reveals error type"],
    limitations: ["Doesn't show probabilities"],
    mistakes: ["Not normalising by class"],
    related: ["roc-curve", "feature-importance"],
    keywords: ["confusion", "matrix", "classifier"],
    preview: "confusion",
    code: [
      py("Matplotlib", `from sklearn.metrics import ConfusionMatrixDisplay
ConfusionMatrixDisplay.from_estimator(model, X, y)`, "One-liner from sklearn."),
      py("Seaborn", `sns.heatmap(cm, annot=True, fmt="d")`, "Heatmap with counts."),
      py("Plotly", `px.imshow(cm, text_auto=True)`, "Interactive tooltips."),
    ],
  },
  {
    slug: "roc-curve", name: "ROC Curve", category: "Machine Learning",
    tagline: "The classifier trade-off.",
    summary: "True positive rate vs false positive rate at every threshold. Area under it is a headline metric.",
    difficulty: "Intermediate",
    whenToUse: ["Binary classifier evaluation"],
    whenNotToUse: ["Multi-class without one-vs-rest"],
    businessExample: "Comparing two fraud detection models.",
    advantages: ["Threshold-independent"],
    limitations: ["Misleading with severe class imbalance"],
    mistakes: ["Comparing without the AUC number"],
    related: ["confusion-matrix", "learning-curve"],
    keywords: ["roc", "auc", "classifier"],
    preview: "roc",
    code: [
      py("Matplotlib", `from sklearn.metrics import RocCurveDisplay
RocCurveDisplay.from_estimator(model, X, y)`, "sklearn plots and calculates AUC."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `# use go.Scatter with fpr/tpr`, ""),
    ],
  },
  {
    slug: "learning-curve", name: "Learning Curve", category: "Machine Learning",
    tagline: "Does more data help?",
    summary: "Model performance as a function of training set size. Diagnoses under- vs overfitting.",
    difficulty: "Advanced",
    whenToUse: ["Diagnosing bias vs variance"],
    whenNotToUse: ["Small experiments"],
    businessExample: "Deciding whether to collect more labelled data.",
    advantages: ["Reveals if more data helps"],
    limitations: ["Requires several training runs"],
    mistakes: ["Not shading the variance band"],
    related: ["roc-curve", "feature-importance"],
    keywords: ["learning", "curve", "ml"],
    preview: "learning",
    code: [
      py("Matplotlib", `from sklearn.model_selection import LearningCurveDisplay
LearningCurveDisplay.from_estimator(model, X, y)`, "sklearn helper."),
      py("Seaborn", `# not native`, ""),
      py("Plotly", `# use go.Scatter with error bars`, ""),
    ],
  },
  {
    slug: "feature-importance", name: "Feature Importance", category: "Machine Learning",
    tagline: "What drives the model.",
    summary: "A bar chart ranking features by their contribution. Simplest way to explain a model.",
    difficulty: "Intermediate",
    whenToUse: ["Model interpretability"],
    whenNotToUse: ["Correlated features (values mislead)"],
    businessExample: "Top drivers of customer churn per your model.",
    advantages: ["Instantly actionable"],
    limitations: ["Doesn't show direction of effect"],
    mistakes: ["Using with highly correlated features without care"],
    related: ["decision-tree", "roc-curve"],
    keywords: ["feature", "importance", "shap"],
    preview: "featureImp",
    code: [
      py("Matplotlib", `plt.barh(features, model.feature_importances_)`, "Just a horizontal bar of the array."),
      py("Seaborn", `sns.barplot(x=imp, y=features, orient="h")`, "Cleaner defaults."),
      py("Plotly", `px.bar(df, x="importance", y="feature", orientation="h")`, "Interactive hover."),
    ],
  },
  {
    slug: "pca-visualization", name: "PCA Visualization", category: "Machine Learning",
    tagline: "High dimensions, on paper.",
    summary: "Scatter plot of principal components — the standard way to look at high-dimensional data.",
    difficulty: "Advanced",
    whenToUse: ["Exploring high-dimensional data"],
    whenNotToUse: ["Non-linear structure (use t-SNE/UMAP)"],
    businessExample: "Customer segments in a 30-feature space, reduced to 2D.",
    advantages: ["Simple", "Fast"],
    limitations: ["Linear only", "Loses information"],
    mistakes: ["Not scaling features first"],
    related: ["cluster-plot", "scatter-plot"],
    keywords: ["pca", "dimensionality", "reduction"],
    preview: "pca",
    code: [
      py("Matplotlib", `from sklearn.decomposition import PCA
pcs = PCA(2).fit_transform(X)
plt.scatter(pcs[:,0], pcs[:,1], c=y)`, "Two lines end-to-end."),
      py("Seaborn", `sns.scatterplot(x=pcs[:,0], y=pcs[:,1], hue=y)`, "Colour by class."),
      py("Plotly", `px.scatter(x=pcs[:,0], y=pcs[:,1], color=y)`, "Interactive brushing."),
    ],
  },
  {
    slug: "cluster-plot", name: "Cluster Plot", category: "Machine Learning",
    tagline: "Groups the algorithm found.",
    summary: "Scatter plot coloured by predicted cluster label. Assesses unsupervised results.",
    difficulty: "Intermediate",
    whenToUse: ["Evaluating clustering results"],
    whenNotToUse: ["High-dim without projection"],
    businessExample: "Customer segments from k-means, projected to 2D.",
    advantages: ["Visual evaluation"],
    limitations: ["Depends on projection quality"],
    mistakes: ["Using categorical palette with too few clusters distinguishable"],
    related: ["pca-visualization", "scatter-plot"],
    keywords: ["cluster", "kmeans", "unsupervised"],
    preview: "cluster",
    code: [
      py("Matplotlib", `plt.scatter(X[:,0], X[:,1], c=labels)`, "Colour by cluster id."),
      py("Seaborn", `sns.scatterplot(x=X[:,0], y=X[:,1], hue=labels, palette="deep")`, "Better colour palette."),
      py("Plotly", `px.scatter(x=X[:,0], y=X[:,1], color=labels.astype(str))`, "Cast labels to string for categorical colouring."),
    ],
  },
];

export const CATEGORIES: Category[] = [
  "Comparison", "Ranking", "Time Series", "Distribution",
  "Relationship", "Composition", "Flow", "Hierarchy",
  "Maps", "Machine Learning", "Business", "Statistical",
];

export const CATEGORY_META: Record<Category, { blurb: string; hue: number }> = {
  "Comparison": { blurb: "See how things stack up against each other.", hue: 262 },
  "Ranking": { blurb: "Order matters — who's first, who's last.", hue: 340 },
  "Time Series": { blurb: "Watch the world change through time.", hue: 210 },
  "Distribution": { blurb: "Understand the shape of your data.", hue: 42 },
  "Relationship": { blurb: "How do two things move together?", hue: 180 },
  "Composition": { blurb: "The parts that make the whole.", hue: 150 },
  "Flow": { blurb: "Where things go and how much moves.", hue: 24 },
  "Hierarchy": { blurb: "Structure, nested and layered.", hue: 300 },
  "Maps": { blurb: "Data with a sense of place.", hue: 200 },
  "Machine Learning": { blurb: "Explain what the model is doing.", hue: 280 },
  "Business": { blurb: "Charts you'll show in a board meeting.", hue: 12 },
  "Statistical": { blurb: "For the seriously curious.", hue: 110 },
};

export function chartBySlug(slug: string) {
  return CHARTS.find((c) => c.slug === slug);
}

export function chartsByCategory(cat: Category) {
  return CHARTS.filter((c) => c.category === cat);
}

// import { usageData } from "./usage-data";
// import { courseData } from "./course-data";
import { useEffect, useState } from "react";
import { analyzedData } from "./analyzed";

const App = () => {
    const deepClone = obj => {
        return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    }

    let months = [];
    let years = [];

    analyzedData.map((current) => {
        if (!months.includes(current.month))
            months.push(current.month);

        if (!years.includes(current.year))
            years.push(current.year);
    });

    const [analyticsTarget, setAnalyticsTarget] = useState({
        month: "May",
        year: "2022",
        analytics: {}
    });

    useEffect(() => {
        const analyticsTargetClone = deepClone(analyticsTarget);
        const analytics = analyzedData.find(a => a.month === analyticsTargetClone.month && a.year === analyticsTargetClone.year);
        analyticsTargetClone.analytics = analytics ? analytics : {};

        setAnalyticsTarget(analyticsTargetClone);
    }, [])

    const updateTarget = (event, target) => {
        const analyticsTargetClone = deepClone(analyticsTarget);
        analyticsTargetClone[target] = event.target.value;
        const analytics = analyzedData.find(a => a.month === analyticsTargetClone.month && a.year === analyticsTargetClone.year);
        analyticsTargetClone.analytics = analytics ? analytics : {};

        setAnalyticsTarget(analyticsTargetClone);
    }

    // let usage = [];
    // let undefineds = [];

    // for (let i = 0; i < usageData.length; i++) {
    //     usage.push({
    //         month: usageData[i].month,
    //         year: usageData[i].year,
    //         net_usage: 0,
    //         net_course_usage: 0,
    //         dept_usage: {}
    //     });

    //     for (let j = 0; j < usageData[i].usage.length; j++) {
    //         if (usageData[i].usage[j].url.includes("/courses/course-v1:buX+")) {
    //             usage[i].net_course_usage += usageData[i].usage[j].hits;
    //             let dept = courseData.find(c => c.course === usageData[i].usage[j].url.split("+")[1]);

    //             if (!dept) {
    //                 undefineds.push(usageData[i].usage[j].url.split("+")[1]);
    //             } else {
    //                 dept = dept.dept;

    //                 if (!Object.keys(usage[i].dept_usage).includes(dept))
    //                     usage[i].dept_usage[dept] = { usage: 0, courses: {} };

    //                 usage[i].dept_usage[dept].usage += usageData[i].usage[j].hits;

    //                 if (Object.keys(usage[i].dept_usage[dept].courses).includes(usageData[i].usage[j].url.split("+")[1])) {
    //                     usage[i].dept_usage[dept].courses[usageData[i].usage[j].url.split("+")[1]] += usageData[i].usage[j].hits;
    //                 } else {
    //                     usage[i].dept_usage[dept].courses[usageData[i].usage[j].url.split("+")[1]] = usageData[i].usage[j].hits;
    //                 }
    //             }
    //         }

    //         usage[i].net_usage += usageData[i].usage[j].hits;
    //     }
    // }

    // console.log(JSON.stringify(usage));
    // console.log(usage);

    return <div className="w-[100vw] h-[100vh] bg-[#232323] text-white p-10">
        <div className="flex flex-col">
            <div className="flex flex-row w-[100%] md:w-[80%] mx-auto bg-[#ddd]/[0.1] p-5 gap-5 rounded-t-xl">
                <select className="bg-[#171717]/[0.5] px-2 py-3 rounded-xl w-[100%] md:w-[50%]" value={analyticsTarget.month} onChange={event => updateTarget(event, "month")}>
                    {months.map((m, mIndex) => <option value={m} key={`${m}-${mIndex}`}>{m}</option>)}
                </select>
                <select className="bg-[#171717]/[0.5] px-2 py-3 rounded-xl w-[100%] md:w-[50%]" value={analyticsTarget.yaer} onChange={event => updateTarget(event, "year")}>
                    {years.map((y, yIndex) => <option value={y} key={`${y}-${yIndex}`}>{y}</option>)}
                </select>
            </div>

            <div className={`flex flex-col w-[100%] md:w-[80%] mx-auto bg-[#ddd]/[0.1] p-5 gap-5 rounded-b-xl ${Object.keys(analyticsTarget.analytics).length ? "" : "justify-center"} h-[80vh] overflow-y-scroll no-scroll-bar`}>
                {
                    Object.keys(analyticsTarget.analytics).length ?
                        <div className="flex flex-col gap-5">
                            <div className="bg-[#171717]/[0.5] rounded-xl w-[100%] p-5 flex flex-col md:flex-row justify-between md:flex-wrap">
                                <div className="flex flex-row justify-between w-[100%] md:w-[calc(50%-2.5rem)] border-b-2 my-5">
                                    <span>Net usage:</span> {analyticsTarget.analytics.net_usage}
                                </div>
                                <div className="flex flex-row justify-between w-[100%] md:w-[calc(50%-2.5rem)] border-b-2 my-5">
                                    <span>Net course usage:</span> {analyticsTarget.analytics.net_course_usage}
                                </div>
                                <div className="flex flex-row justify-between w-[100%] md:w-[calc(50%-2.5rem)] border-b-2 my-5">
                                    <span>Usage Departments:</span> {Object.keys(analyticsTarget.analytics.dept_usage).length}
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-row overflow-scroll no-scroll-bar bg-[#171717]/[0.5] px-5 py-3">
                                    <div className="w-[200px]">Department</div>
                                    <div className="w-[200px]">Usage</div>
                                    <div className="w-[200px]">Usage (%)</div>
                                    <div className="w-[200px]">Courses</div>
                                </div>
                                {Object.keys(analyticsTarget.analytics.dept_usage).map((dept, deptIndex) => <div className={`flex flex-row overflow-scroll no-scroll-bar ${deptIndex % 2 ? "bg-[#171717]/[0.5]" : ""} px-5 py-3`} key={`${dept}`}>
                                    <div className="w-[200px]">{dept}</div>
                                    <div className="w-[200px]">{analyticsTarget.analytics.dept_usage[dept].usage}</div>
                                    <div className="w-[200px]">{(100 * analyticsTarget.analytics.dept_usage[dept].usage / analyticsTarget.analytics.net_course_usage).toFixed(2)} %</div>
                                    <div className="w-[200px]">{Object.keys(analyticsTarget.analytics.dept_usage[dept].courses).length}</div>
                                </div>)}
                            </div>
                        </div>
                        :
                        <h1 className="text-[2rem] text-center ">No Analyzed Data to Show</h1>
                }
            </div>
        </div>
    </div>
}

export default App;

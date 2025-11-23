import React, { useState } from "react";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GitGraph({ activeDays = [] }) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const activeSet = new Set(activeDays || []);

  const months = [
    { name: "January", days: 31 },
    { name: "February", days: 28 },
    { name: "March", days: 31 },
    { name: "April", days: 30 },
    { name: "May", days: 31 },
    { name: "June", days: 30 },
    { name: "July", days: 31 },
    { name: "August", days: 31 },
    { name: "September", days: 30 },
    { name: "October", days: 31 },
    { name: "November", days: 30 },
    { name: "December", days: 31 },
  ];

  function giveMonthArray(monthIndex, daysInMonth) {
    const currentYear = moment().year();
    let daygrid = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment({
        year: currentYear,
        month: monthIndex,
        day: i,
      }).format("YYYY-MM-DD");
      const isActive = activeSet.has(date);

      daygrid.push(
        <div
          key={date}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          title={`${date} - ${isActive ? "Active" : "No activity"}`}
          className={`
            h-3 w-3 sm:h-4 sm:w-4 rounded-sm cursor-pointer
            transition-all duration-200 hover:ring-2 hover:ring-offset-1
            ${
              isActive
                ? "bg-green-500 hover:ring-green-400 hover:scale-125"
                : "bg-muted hover:bg-muted/80"
            }
            ${hoveredDate === date ? "ring-2 ring-offset-1 ring-primary" : ""}
          `}
        />
      );
    }

    return daygrid;
  }

  const totalActive = activeSet.size;
  const averagePerMonth = (totalActive / 12).toFixed(1);

  return (
    <Card className="bg-card border-border w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg">Contribution Graph</CardTitle>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{totalActive}</span>{" "}
              active days
            </div>
            <div>
              <span className="font-semibold text-foreground">
                {averagePerMonth}
              </span>{" "}
              avg/month
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto pb-4">
        <div className="min-w-fit">
          <div
            className="grid gap-6 md:gap-8 p-2"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            }}
          >
            {months.map((month, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                {/* Month Label */}
                <div className="text-xs font-semibold text-muted-foreground text-center h-8 flex items-center">
                  {month.name.substring(0, 3)}
                </div>

                {/* Grid */}
                <div
                  className="gap-1 flex flex-wrap justify-center"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, 16px)",
                  }}
                >
                  {giveMonthArray(index, month.days)}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
            <span className="font-semibold">Activity:</span>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-muted" />
              <span>No activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-green-500" />
              <span>Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
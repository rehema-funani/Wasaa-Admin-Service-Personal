import React from "react";

const CustomTooltip = ({
  active,
  payload,
  label,
  items = [],
  showTotal = false,
  currency = "$",
}) => {
  if (!active || !payload || !payload.length) return null;

  const total = showTotal
    ? payload.reduce((sum, entry) => sum + (entry.value || 0), 0)
    : null;

  const displayItems =
    items.length > 0
      ? items
      : payload.map((entry) => ({
          key: entry.dataKey,
          label: entry.name || entry.dataKey,
          color: entry.color || entry.stroke,
          formatter: (value) => value.toLocaleString(),
        }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <p className="text-gray-600 text-xs mb-2 font-medium">{label}</p>

      {/* Data Items */}
      <div className="space-y-2">
        {displayItems.map((item, index) => {
          const entry = payload.find(
            (p) => p.dataKey === item.key || p.name === item.key
          );
          if (!entry) return null;

          const value = item.formatter
            ? item.formatter(entry.value)
            : entry.value.toLocaleString();

          return (
            <p
              key={index}
              className="flex justify-between items-center text-sm"
            >
              <span
                className="font-medium mr-3"
                style={{ color: item.color || entry.stroke || "#374151" }}
              >
                {item.label}:
              </span>
              <span className="font-semibold">
                {item.prefix || ""}
                {currency && !item.hideCurrency ? currency : ""}
                {value}
                {item.suffix || ""}
              </span>
            </p>
          );
        })}

        {/* Total row if enabled */}
        {showTotal && (
          <p className="flex justify-between items-center text-sm border-t border-gray-100 pt-2 mt-2">
            <span className="font-medium text-gray-800 mr-3">Total:</span>
            <span className="font-semibold">
              {currency}
              {total.toLocaleString()}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomTooltip;

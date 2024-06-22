/* eslint-disable react/prop-types */
import "./timetable.css";
const TimeTable = ({ data, selectedOption }) => {
  const firstLetter = selectedOption.charAt(0).toUpperCase();
  const restOfText = selectedOption.slice(1);

  const convertToLocalTime = (isoString) => {
    const dateUTC = new Date(isoString);
    const dateLocal = new Date(dateUTC.getTime() + 330 * 60 * 1000); // IST is UTC +5:30 hours
    return dateLocal.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Date</th>
          <th>{firstLetter + restOfText} Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((dayData, index) => (
          <tr key={index}>
            <td>
              {new Date(dayData.name).toLocaleString("en-US", {
                weekday: "long",
              })}
            </td>
            <td>
              {new Date(dayData.name).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
            <td>{convertToLocalTime(dayData[selectedOption])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TimeTable;

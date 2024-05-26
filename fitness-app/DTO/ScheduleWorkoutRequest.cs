public class ScheduleWorkoutRequest
{
    public int WorkoutId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string? Notes { get; set; }
}

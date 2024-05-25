using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNavigationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_WorkoutExerciseOrders_ExerciseId",
                table: "WorkoutExerciseOrders",
                column: "ExerciseId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutExerciseOrders_Exercises_ExerciseId",
                table: "WorkoutExerciseOrders",
                column: "ExerciseId",
                principalTable: "Exercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutExerciseOrders_Exercises_ExerciseId",
                table: "WorkoutExerciseOrders");

            migrationBuilder.DropIndex(
                name: "IX_WorkoutExerciseOrders_ExerciseId",
                table: "WorkoutExerciseOrders");
        }
    }
}

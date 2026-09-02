using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNavigationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_workout_entries_exercise_id",
                table: "workout_entries",
                column: "exercise_id");

            migrationBuilder.CreateIndex(
                name: "IX_workout_entries_workout_id",
                table: "workout_entries",
                column: "workout_id");

            migrationBuilder.CreateIndex(
                name: "IX_sets_workout_entry_id",
                table: "sets",
                column: "workout_entry_id");

            migrationBuilder.AddForeignKey(
                name: "FK_sets_workout_entries_workout_entry_id",
                table: "sets",
                column: "workout_entry_id",
                principalTable: "workout_entries",
                principalColumn: "workout_entry_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workout_entries_exercises_exercise_id",
                table: "workout_entries",
                column: "exercise_id",
                principalTable: "exercises",
                principalColumn: "exercise_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workout_entries_workouts_workout_id",
                table: "workout_entries",
                column: "workout_id",
                principalTable: "workouts",
                principalColumn: "workout_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_sets_workout_entries_workout_entry_id",
                table: "sets");

            migrationBuilder.DropForeignKey(
                name: "FK_workout_entries_exercises_exercise_id",
                table: "workout_entries");

            migrationBuilder.DropForeignKey(
                name: "FK_workout_entries_workouts_workout_id",
                table: "workout_entries");

            migrationBuilder.DropIndex(
                name: "IX_workout_entries_exercise_id",
                table: "workout_entries");

            migrationBuilder.DropIndex(
                name: "IX_workout_entries_workout_id",
                table: "workout_entries");

            migrationBuilder.DropIndex(
                name: "IX_sets_workout_entry_id",
                table: "sets");
        }
    }
}

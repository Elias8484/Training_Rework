using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTestTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MigrationTests",
                table: "MigrationTests");

            migrationBuilder.RenameTable(
                name: "MigrationTests",
                newName: "migrationtests");

            migrationBuilder.AddPrimaryKey(
                name: "PK_migrationtests",
                table: "migrationtests",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_migrationtests",
                table: "migrationtests");

            migrationBuilder.RenameTable(
                name: "migrationtests",
                newName: "MigrationTests");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MigrationTests",
                table: "MigrationTests",
                column: "Id");
        }
    }
}

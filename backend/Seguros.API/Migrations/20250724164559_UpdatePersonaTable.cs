using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Seguros.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePersonaTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AditionalData",
                table: "Personas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AditionalData",
                table: "Personas");
        }
    }
}

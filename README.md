-- [[ TẢI RAYFIELD ]]
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

-- [[ CỬA SỔ CHÍNH ]]
local Window = Rayfield:CreateWindow({
   Name = "🍋 Lemon Tycoon Hub",
   Icon = 0,
   LoadingTitle = "Đang tải...",
   LoadingSubtitle = "by Assistant",
   ConfigurationSaving = { Enabled = false },
   Discord = { Enabled = false },
   KeySystem = false
})

-- STATE
local _G_AutoUpgrade = false

-- Tìm Tycoon của người chơi hiện tại
local function findMyTycoon()
    local player = game.Players.LocalPlayer
    local character = player.Character
    if not character then return nil end
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if not hrp then return nil end

    local nearestTycoon = nil
    local nearestDistance = math.huge

    for _, obj in pairs(workspace:GetChildren()) do
        if obj:IsA("Model") and obj.Name:find("Tycoon") then
            local distance = (obj:GetPivot().Position - hrp.Position).Magnitude
            if distance < nearestDistance then
                nearestTycoon = obj
                nearestDistance = distance
            end
        end
    end
    return nearestTycoon
end

-- Lấy Upgrade LemonDash từ Tycoon
local function getLemonDashUpgrade(tycoon)
    if not tycoon then return nil end
    return tycoon:FindFirstChild("Purchases"):FindFirstChild("LemonDash"):FindFirstChild("LemonDash"):FindFirstChild("LemonDash"):FindFirstChild("Upgrade")
end

-- Lấy Upgrade Lemon Stand từ Tycoon
local function getLemonStandUpgrade(tycoon)
    if not tycoon then return nil end
    return tycoon:FindFirstChild("Purchases"):FindFirstChild("Lemon Stand"):FindFirstChild("Lemon Stand"):FindFirstChild("Lemon Stand"):FindFirstChild("Upgrade")
end

-- ============================
-- TAB FARM
-- ============================
local FarmTab = Window:CreateTab("Farm", 4483362458)

FarmTab:CreateParagraph({
    Title = "⚙️ Tự động nâng cấp",
    Content = "Bật để tự động nâng cấp LemonDash và Lemon Stand (tự tìm Tycoon của bạn)."
})

FarmTab:CreateToggle({
    Name = "Nâng cấp",
    CurrentValue = false,
    Flag = "ToggleUpgrade",
    Callback = function(Value)
        _G_AutoUpgrade = Value
        if _G_AutoUpgrade then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động nâng cấp!", Duration = 3})
            task.spawn(function()
                while _G_AutoUpgrade do
                    local tycoon = findMyTycoon()
                    if tycoon then
                        -- Nâng cấp LemonDash
                        local upgradeDash = getLemonDashUpgrade(tycoon)
                        if upgradeDash then
                            pcall(function()
                                upgradeDash:InvokeServer(1)
                            end)
                        end

                        -- Nâng cấp Lemon Stand
                        local upgradeStand = getLemonStandUpgrade(tycoon)
                        if upgradeStand then
                            pcall(function()
                                upgradeStand:InvokeServer(1)
                            end)
                        end
                    else
                        Rayfield:Notify({Title = "⚠️", Content = "Không tìm thấy Tycoon của bạn!", Duration = 2})
                    end

                    task.wait(0.5)
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng tự động nâng cấp!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt tự động nâng cấp!", Duration = 3})
        end
    end
})

-- Thông báo khởi tạo
Rayfield:Notify({Title = "🍋", Content = "Script đã sẵn sàng!", Duration = 3})
